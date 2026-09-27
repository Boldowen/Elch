# ELCH — Mongolia Tourism Intelligence Platform

ELCH is an Expo mobile marketplace backed by NestJS, Prisma, and PostgreSQL. The
research extension evaluates a route-aware, safety-constrained multilingual travel
assistant and competency-based guide matching without replacing the marketplace's
existing authentication, bookings, listings, conversations, reviews, or moderation.

The software supports a local demo, but verified operational data, formal research
governance, external services, and production operations are not supplied by source
code. See the [launch readiness runbook](docs/LAUNCH_READINESS.md) for the explicit
implemented/operator/human/future-work split and go/no-go gates.

## Research architecture

```text
Authenticated traveler request
  -> deterministic request classification and constraint extraction
  -> experiment switch (A/B/C/D/E)
  -> verified tourism retrieval (when enabled)
  -> RouteGraph and controlled application tools (when enabled)
  -> candidate itinerary
  -> deterministic route/safety validator
  -> feasibility verdict (feasible / repairable / gated / unsolvable)
  -> at most one controlled repair, skipped when the request is unsolvable
  -> hard-gate guide eligibility and explainable ranking
  -> structured response + citations + experiment log
```

The LLM provider is replaceable. Durable tourism data lives in PostgreSQL as
sources, knowledge chunks, routes, nodes, edges, assessment records, and outcomes.
The platform never treats AI language scoring as an official CEFR certificate,
never grants a guide license, and never treats first-aid theory as practical proof.

### Experiment modes

| Mode | Plan | Model | RAG | RouteGraph/tools/validator |
|---|---|---|---:|---:|
| A | E0 Base | `AI_DEFAULT_MODEL` | no | no |
| B | E1 RAG | `AI_DEFAULT_MODEL` | yes | no |
| C | E2 LoRA | `AI_ADVANCED_MODEL` | no | no |
| D | E3 LoRA+RAG | `AI_ADVANCED_MODEL` | yes | no |
| E | E4 Full | `AI_ADVANCED_MODEL` | yes | yes |

Select with `AI_EXPERIMENT_MODE=A|B|C|D|E`. Source-code branching is shared and
composable; changing the mode does not duplicate the assistant pipeline.

Model settings are `provider:model` references, so each arm can point at a different
backend without code changes:

| Prefix | Backend |
|---|---|
| `anthropic:` | Claude through the official Anthropic SDK (streaming tool loop, adaptive thinking, prompt caching, server-side refusal fallback) |
| `compat:` | Any OpenAI-compatible chat endpoint at `AI_COMPAT_BASE_URL` (vLLM/Ollama serving the base or LoRA open-weight model on Kaggle, a rented GPU or the project's own server) |
| `openai:` | OpenAI Responses API |

For the thesis ablation, set `AI_DEFAULT_MODEL=compat:<base model>` and
`AI_ADVANCED_MODEL=compat:<LoRA adapter>` so A–E isolate the fine-tuning effect on
one model family; Claude (`anthropic:claude-opus-5`) is the production assistant and
an additional strong-API reference arm. Safety intents always use `AI_SAFETY_MODEL`.
A model name is not evidence of fine-tuning: C–E only become domain-model experiments
once a real frozen adapter is served.

## Start locally

```bash
cp .env.example .env
# The Expo emulator default expects this port.
printf '\nBACKEND_PORT=3001\n' >> .env
docker compose up --build
docker compose exec backend npm run prisma:seed
```

In another terminal:

```bash
cd frontend
npm install
npm start
```

- API: `http://localhost:3001/api/v1` with the `BACKEND_PORT` setting above
- Swagger: `http://localhost:3001/docs`
- pgAdmin: `http://localhost:5050` unless `PGADMIN_PORT` is overridden

The research seed is explicitly prototype/demo data. It is not a verified production
corpus and cannot support factual research conclusions without human source review.
It creates 6 provenance sources, 4 route families, 14 nodes, 10 edges, 4 lexical demo
knowledge chunks, and 18 assessment questions. Prototype source verification dates are
deliberately non-production.

## Research APIs

All write, assistant, assessment, matching, ingestion, and research endpoints require
JWT authentication; admin ingestion/review/export endpoints also require `ADMIN`.
Only the route catalog and route-detail reads are public.

| Area | Endpoints |
|---|---|
| Assistant | `POST /api/v1/research-assistant/query`, owned conversation list/detail |
| Assistant stream | `POST /api/v1/research-assistant/stream` (SSE) |
| Routes | public `GET /api/v1/research-routes`; protected `POST .../plan` and `.../validate` |
| Route administration | admin RouteGraph CRUD under `/api/v1/admin/route-graph` |
| Route safety | owned R3/R4 safety-plan draft/submit plus admin review/revoke |
| RAG | `POST /api/v1/tourism-knowledge/search`; admin source creation and ingestion |
| Assessments | dashboard, attempts, saved responses, submit, consented language estimate, admin review/question bank |
| Matching | `POST /api/v1/guide-research/match` |
| Booking safety | `POST /api/v1/bookings/drafts`, then explicit owner submit |
| Research | admin summary, runs, human evaluations, pseudonymized CSV/JSON export |
| Operations | admin in-process metrics and manual expiry-job trigger |

Swagger at `/docs` is the authoritative request/response reference.

### Itinerary validation verdicts

`POST /api/v1/research-routes/validate` and the planner both return a
`feasibility` verdict alongside the issue list, implementing the plan's
`UNSOLVABLE` rule (section 7.3):

| Status | Meaning |
|---|---|
| `FEASIBLE` | Every hard constraint passed. |
| `REPAIRABLE` | A blocking issue that re-scheduling the same stops can clear; one bounded repair round runs. |
| `REQUIRES_EXTERNAL_APPROVAL` | Only guide-eligibility, risk-escalation or source-provenance gates remain. Not impossible, but it needs an eligible guide or a recorded human approval. |
| `UNSOLVABLE` | The constraints cannot be satisfied together on this route, whatever the schedule: a closed season, a mode-locked edge, an irreducible time or cost floor, or a disconnected node. No repair is attempted and the assistant proposes no itinerary. |

Each unsolvable verdict carries machine-readable reasons (`TIME_BUDGET_EXCEEDED`,
`SEASON_CLOSED_ALL_DAYS`, `TRANSPORT_UNAVAILABLE`, `BUDGET_INSUFFICIENT`,
`POI_DISCONNECTED`) so an infeasible request is reported as infeasible rather
than answered with a plan that cannot happen.

## Database migration and seed

From `backend/` outside Docker, use a localhost `DATABASE_URL`:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

For a new development migration use `npm run prisma:migrate`; deployments must use
`npm run prisma:deploy`. The seed is idempotent and preserves marketplace data.

## RAG ingestion

1. An admin creates a provenance row with `POST /api/v1/tourism-knowledge/sources`.
2. The admin submits text to `POST /api/v1/tourism-knowledge/ingest`; its chunks are
   staged inactive while the source is pending.
3. An accountable admin records a human verify/reject decision, reviewer, date,
   notes, and license/permitted-use statement through the source-review endpoint.
4. The server activates only chunks belonging to a human-verified source. Authenticated
   retrieval uses `POST /api/v1/tourism-knowledge/search`.

Authority metadata affects ranking but is not itself proof of endorsement. A recent
`lastVerifiedAt` date or authoritative-looking title never substitutes for the explicit
human-review decision.

Ingestion stages every embedding before a database transaction, records exact
provider/model/dimension identity, and falls back to lexical scoring rather than
comparing incompatible vectors.

## Guide research

Guide assessments support language, general knowledge, performance, route-specific,
safety, and first-aid theory attempts. Answer keys are never returned through guide
APIs. AI scores remain pre-screening until a blind human reviewer verifies them.
Matching applies legal role, language, route competency, specialty, availability, and
first-aid hard gates before configurable weighted ranking.

Language evaluation uses only the assigned, saved speaking-task responses after an
explicit consent flag; arbitrary caller transcripts are ignored. First-aid theory
always leaves practical verification as `NOT_ASSESSED`. Booking creation from an AI
tool produces only an inert `DRAFT`; inventory and provider notification begin only
after the owning traveler explicitly submits it.

## AI configuration and cost controls

The canonical variable list is [.env.example](.env.example). Important controls are:

- `AI_PROVIDER=local|anthropic|openai` and `provider:model` references per role;
- `ANTHROPIC_*` settings (model, optional effort, max tokens, timeout, refusal
  fallback). Claude cost telemetry is computed per model and includes prompt-cache
  reads/writes;
- embeddings configured separately (`AI_EMBEDDING_PROVIDER=auto|local|openai|compat`),
  because Claude has no embedding API. Retrieval compares only vectors with an identical
  backend/model/dimension identity and otherwise falls back to lexical scoring;
- A–E experiment selection, with request overrides disabled by default;
- input/output caps, daily per-user request limit, maximum tool rounds, timeout, and
  at most two bounded transient retries (`AI_RETRY_ATTEMPTS`, default `1`);
- bounded history, streaming timeouts, per-process response/live-data caches, and a
  model allow-list;
- configurable RAG top-K/threshold/candidate bound and guide-ranking weights;
- fail-closed `disabled`, deterministic `mock`, and HTTPS `live` data modes for
  weather, road closure, permit, and transport adapters;
- private local/S3-compatible evidence storage settings;
- `RESEARCH_EXPORT_ENABLED` plus a private random `RESEARCH_EXPORT_SALT` of at least
  16 characters for stable HMAC pseudonyms.

The raw OpenAI-compatible provider uses the Responses API structured-output envelope.
Paid calls are mocked in tests; `AI_PROVIDER=local` is the safe no-key development
default and explicitly reports when verified/generated information is unavailable.
After adding `ANTHROPIC_API_KEY` to `.env`, `cd backend && npm run ai:smoke` makes
three small live requests (classification plus a two-turn tool loop against the
in-memory RouteGraph) and prints token usage, including prompt-cache reads.

## Research data and training

See [research/README.md](research/README.md) for:

- JSONL validation, cleaning, deduplication, grouped splitting, and leakage audits;
- CSV/JSON pseudonymized export and the travel, guide, guide-match and assessment
  item metric families;
- a single command that recomputes every primary metric
  (`make research-metrics ALLOW_DEMO=1`);
- offline, manually invoked QLoRA training;
- ethics, consent, anonymization, and reproducibility requirements.

Training never runs during app startup and never downloads a large model automatically.

## Validation commands

```bash
cd backend
npm run prisma:generate
npx prisma validate
npm run build
npm run lint
npm test

cd ../frontend
npm run export:android
npm run export:web

cd ..
python3 -m unittest discover -s research/tests -v
```

The booking integration suite is skipped by the normal unit-test command. It requires
`NODE_ENV=test`, `RUN_INTEGRATION_TESTS=1`, and an isolated database whose name
contains `elch_test`; it intentionally refuses the development DB. Apply migrations
to that database, then run `npm run test:integration` with its isolated
`DATABASE_URL`.

For research tooling:

```bash
python3 -m compileall -q research/scripts research/training research/tests
python3 -m unittest discover -s research/tests -v

# Recompute every primary metric from the manifest in one command.
# ALLOW_DEMO=1 is required while the manifest still points at the demo fixtures.
make research-metrics ALLOW_DEMO=1
```

`make test` runs the backend suite and the research tooling suite together.

For an admin export, call `GET /api/v1/research/export?format=json` or
`?format=csv` with an admin bearer token. Export schema v2 is a privacy-bounded,
long-form dataset covering AI runs/evaluations, guide assessment attempts, language
scores, general and route competency, first-aid evidence, and guide-match outcomes.
The API uses a strict field whitelist, HMAC-pseudonymized IDs, allow-listed matching
factors/failure codes, and no document references or reviewer notes. A human privacy
review is still required before external release.

## Production checklist

Do not treat the Compose demo as a production deployment. Complete the secrets,
live-data, storage, privacy, source licensing, backup/restore, observability, security,
mobile-distribution, and research gates in
[docs/LAUNCH_READINESS.md](docs/LAUNCH_READINESS.md). In particular, never expose
pgAdmin publicly and never run the demo seed against production.

## Important limitations

The repository supplies the platform and reproducible research pipeline. It does not
fabricate a verified 2,000–5,000 chunk corpus, a trained LoRA adapter, guide speech,
human expert scores, or statistical findings. Those remain controlled research data
collection and manual training tasks.
