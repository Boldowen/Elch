# ELCH — Mongolia Tourism Intelligence Platform

ELCH is an Expo mobile marketplace backed by NestJS, Prisma, and PostgreSQL. The
research extension evaluates a route-aware, safety-constrained multilingual travel
assistant and competency-based guide matching without replacing the marketplace's
existing authentication, bookings, listings, conversations, reviews, or moderation.

## Research architecture

```text
Authenticated traveler request
  -> deterministic request classification and constraint extraction
  -> experiment switch (A/B/C/D/E)
  -> verified tourism retrieval (when enabled)
  -> RouteGraph and controlled application tools (when enabled)
  -> candidate itinerary
  -> deterministic route/safety validator
  -> at most one controlled repair
  -> hard-gate guide eligibility and explainable ranking
  -> structured response + citations + experiment log
```

The LLM provider is replaceable. Durable tourism data lives in PostgreSQL as
sources, knowledge chunks, routes, nodes, edges, assessment records, and outcomes.
The platform never treats AI language scoring as an official CEFR certificate,
never grants a guide license, and never treats first-aid theory as practical proof.

### Experiment modes

| Mode | Model | RAG | RouteGraph/tools/validator |
|---|---|---:|---:|
| A | base | no | no |
| B | base | yes | no |
| C | configurable advanced/domain-model candidate | no | no |
| D | configurable advanced/domain-model candidate | yes | no |
| E | configurable advanced/domain-model candidate | yes | yes |

Select with `AI_EXPERIMENT_MODE=A|B|C|D|E`. Source-code branching is shared and
composable; changing the mode does not duplicate the assistant pipeline. Modes C–E
route text generation to `AI_ADVANCED_MODEL`; point that variable at a reviewed local
adapter/provider model when one exists. The default value is a model candidate, not a
claim that this repository already contains a domain-tuned adapter.

## Start locally

```bash
cp .env.example .env
docker compose up --build
docker compose exec backend npm run prisma:seed
```

In another terminal:

```bash
cd frontend
npm install
npm start
```

- API: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/docs`
- pgAdmin: `http://localhost:5051`

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
| Routes | public `GET /api/v1/research-routes`; protected `POST .../plan` and `.../validate` |
| RAG | `POST /api/v1/tourism-knowledge/search`; admin source creation and ingestion |
| Assessments | dashboard, attempts, saved responses, submit, consented language estimate, admin review/question bank |
| Matching | `POST /api/v1/guide-research/match` |
| Booking safety | `POST /api/v1/bookings/drafts`, then explicit owner submit |
| Research | admin summary, runs, human evaluations, pseudonymized CSV/JSON export |

Swagger at `/docs` is the authoritative request/response reference.

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
2. The admin submits reviewed text to `POST /api/v1/tourism-knowledge/ingest`.
3. The server chunks, hashes, embeds, deduplicates, and stores metadata.
4. Authenticated retrieval uses `POST /api/v1/tourism-knowledge/search`.

Authority metadata affects ranking but is not itself proof of endorsement. Real source
licensing and `lastVerifiedAt` dates must be checked before ingestion.

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

- `AI_PROVIDER=local|openai`, configurable default/advanced/embedding models;
- A–E experiment selection, with request overrides disabled by default;
- input/output caps, daily per-user request limit, maximum tool rounds, timeout, and
  at most two bounded transient retries (`AI_RETRY_ATTEMPTS`, default `1`);
- configurable RAG top-K/threshold and guide-ranking weights;
- `RESEARCH_EXPORT_ENABLED` plus a private random `RESEARCH_EXPORT_SALT` of at least
  16 characters for stable HMAC pseudonyms.

The raw OpenAI-compatible provider uses the Responses API structured-output envelope.
Paid calls are mocked in tests; `AI_PROVIDER=local` is the safe no-key development
default and explicitly reports when verified/generated information is unavailable.

## Research data and training

See [research/README.md](research/README.md) for:

- JSONL validation, cleaning, deduplication, grouped splitting, and leakage audits;
- CSV/JSON pseudonymized export and evaluation metrics;
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
npm test -- --testPathIgnorePatterns=bookings.integration.spec.ts

cd ../frontend
npm run export:android

cd ..
python3 -m unittest discover -s research/tests -v
```

The existing booking integration suite requires `NODE_ENV=test` and an isolated
database whose name contains `elch_test`; it intentionally refuses the development DB.
Apply migrations to that database, then run only
`test/bookings.integration.spec.ts` with its isolated `DATABASE_URL`.

For research tooling:

```bash
python3 -m compileall -q research/scripts research/training research/tests
python3 -m unittest discover -s research/tests -v
```

For an admin export, call `GET /api/v1/research/export?format=json` or
`?format=csv` with an admin bearer token. The API output uses a strict field whitelist
and HMAC-pseudonymized IDs; free-text still requires a human privacy review before
external release.

## Production checklist

- Rotate all JWT/email/AI secrets and keep `.env` out of Git.
- Set production CORS origins and TLS/reverse-proxy limits.
- Configure `AI_PROVIDER=openai` and real model names only after key provisioning.
- Review every corpus source's authority, license, freshness, and content.
- Replace demo routes/questions with expert-reviewed data.
- Configure backups, retention, audit review, monitoring, and request budgets.
- Collect explicit consent before storing guide speech; pseudonymize research exports.
- Recruit qualified human reviewers and freeze evaluation splits before experiments.
- Run migrations and all validation commands against staging before deployment.

## Important limitations

The repository supplies the platform and reproducible research pipeline. It does not
fabricate a verified 2,000–5,000 chunk corpus, a trained LoRA adapter, guide speech,
human expert scores, or statistical findings. Those remain controlled research data
collection and manual training tasks.
