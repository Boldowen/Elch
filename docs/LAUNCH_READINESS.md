# ELCH launch readiness and operations runbook

This document separates software that exists from work that still requires an
operator, a research team, or later scale engineering. Passing automated tests is
necessary, but it does not by itself make the demo routes, AI output, guide scores,
or safety plans suitable for a real trip.

## Current launch status

| Target | Status | Go/no-go condition |
|---|---|---|
| Local engineering demo | Ready after local configuration, migrations, and the explicitly demo-only seed | Run the validation commands below |
| Controlled research pilot | Not ready by code alone | Obtain ethics approval, register consent/withdrawal, freeze reviewed data and rubrics, recruit reviewers, and complete a staging rehearsal |
| Public production travel service | Not ready by code alone | Complete every production gate below, including live-data contracts, verified route data, storage, monitoring, backup/restore, security review, and legal review |

## Implemented in the repository

- NestJS API, PostgreSQL/Prisma schema and migrations, JWT authorization, role
  guards, validation, global throttling, and ownership checks.
- Database-backed four-family RouteGraph, admin editing APIs, deterministic route
  validation, database-owned guide gates, and auditable R3/R4 safety-plan review.
- Replaceable local/OpenAI AI provider, A-E experiment switches, RAG ingestion and
  retrieval, bounded model/tool execution, history trimming, streaming, retry,
  timeout, cost telemetry, and a short-lived per-process cache.
- Controlled destination, route, listing, guide availability/competency/matching,
  tour availability, live-data, and booking-draft tools. Route validation accepts
  budget/transport/permit constraints plus persisted guide and safety-plan
  references.
  A booking created by AI remains an inert `DRAFT` until its owner explicitly
  submits it.
- Guide assessment, blind human review, evidence upload/review, hard-gated guide
  matching, pseudonymized research export, and offline research/evaluation scripts.
- Private local or S3-compatible evidence storage, hourly expiry jobs, structured
  request logs, admin-only process metrics, CI, and tagged backend image publishing.
- Auditable tourism-source licensing/reuse notes and explicit pending, verified, or
  rejected review decisions. Only human-verified, in-window source chunks can enter
  retrieval or satisfy RouteGraph provenance.
- Expo React Native tourist, guide, assessment, booking-draft, and research/admin
  screens, including source review, RouteGraph editing, R3/R4 safety review, and
  private guide-evidence review. Device acceptance testing is still a release gate.

The seed and demo CSV/JSONL files are fixtures, not verified claims or research
results.

## Known implementation gaps

These must not be hidden by deployment configuration:

1. The application records a per-attempt AI-processing consent flag, but it has no
   complete versioned study-consent registry, participant withdrawal workflow, or
   retention/deletion automation for research content and stored evidence.
2. Metrics, throttling, caches, and scheduled jobs are process-local. They need
   shared infrastructure or single-runner controls before horizontal scaling.
3. The Compose stack is a local/single-host stack. It has no TLS ingress, managed
   secret injection, automated database backup, external alerting, or production
   rollout/rollback target. Its pgAdmin service must not be exposed publicly.
4. RAG stores portable JSON embeddings and scores a configurable, bounded candidate
   pool in application memory (`RAG_CANDIDATE_LIMIT`, default 5,000, maximum
   10,000). Before growing beyond the planned bachelor corpus, add measured indexed
   full-text/vector retrieval and test recall, latency, and privacy boundaries.
5. Guide and tour availability tools return bounded database snapshots, not a
   guaranteed reservation. Road closure, permit, and transport answers remain
   unavailable unless operators configure reviewed live services.
6. `permitConfirmed` is a bounded research-preflight input, not evidence that a
   competent authority issued a permit. R3/R4 plans can carry admin-reviewed permit
   references; any booking workflow that relies on permits still needs persisted
   evidence, validity/revocation handling, and an accountable verifier.
7. The repository contains the review workflow and deliberately pending demo
   sources, but it does not contain the legal/source decisions or expert approvals
   themselves. Those decisions must be performed and recorded by accountable humans.

## Required operator configuration and credentials

Create a secret file from `.env.example`, keep it outside Git, and inject the same
values through the deployment platform's secret manager. Never ship any `change_me`,
`replace_with_...`, example OAuth ID, or demo account value.

### Core platform

- Provision a production PostgreSQL database with encrypted connections, a
  least-privilege application role, backup retention, point-in-time recovery where
  available, and a separately authorized migration role.
- Generate independent high-entropy `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
  values; document rotation and active-session invalidation.
- Set the exact HTTPS application origins in `CORS_ORIGINS`. Do not use a wildcard
  with credentials.
- Configure a verified Resend sender/domain and the production email verification
  and password-reset deep links.
- Register production Google and Apple clients for every shipped bundle/package,
  and set both backend and Expo public client IDs.
- Put the API behind TLS, request/body limits, abuse controls, and an allow-listed
  admin access path. Decide whether Swagger is disabled or access-controlled.

### AI and live data

- Keep `AI_PROVIDER=local` for a no-key demo. For a real provider, set
  `AI_PROVIDER=openai`, a secret `OPENAI_API_KEY`, reviewed model IDs, the allowed
  model list, current token prices, budgets, and provider data-retention terms.
- A-E modes C-E only become domain-model experiments after a real frozen adapter or
  reviewed advanced model is supplied. A different model name is not evidence of
  fine-tuning.
- Use `LIVE_DATA_MODE=disabled` for fail-closed development or `mock` only in tests.
  Production needs `LIVE_DATA_MODE=live`.
- Weather has an Open-Meteo adapter. Road closure, permit, and transport require
  trusted HTTPS services matching the validated JSON contracts plus their API keys.
  Contract tests, freshness SLAs, attribution rights, rate limits, outage behavior,
  and an accountable data owner must be agreed before enabling them.

### Private files and research export

- Local storage is suitable only for a single-host demo with a protected persistent
  volume. Production should use a private S3-compatible bucket with public access
  blocked, encryption, limited IAM credentials, versioning/lifecycle policy,
  malware/content scanning, audit logs, and tested deletion.
- Set a private random `RESEARCH_EXPORT_SALT` of at least 16 characters in a secret
  manager. Use a different salt for unrelated recipients unless a documented join
  is approved. Set `RESEARCH_EXPORT_ENABLED=false` outside an approved export window.
- Decide and enforce retention periods for conversations, experiment runs, guide
  responses, review notes, authentication metadata, logs, backups, and evidence
  objects. Database deletion and object deletion must be tested together.

## Required human and data work

- Obtain institutional ethics/IRB approval where applicable before recruiting
  participants or collecting speech, open responses, documents, or expert scores.
- Publish a versioned participant notice and consent form covering purpose, fields,
  processor/model provider, storage, retention, access, withdrawal, sharing, and
  contact details. Keep the identity-to-pseudonym map outside the research dataset.
- Complete a legal/source matrix. For every corpus chunk, question, route node, and
  edge, record source, license/permitted use, reviewer, verification date, validity
  window, and claim-level support.
- Replace all demo routes, edges, prices, travel times, questions, and accounts with
  expert-reviewed data. Operational road, weather, permit, price, and availability
  must be rechecked for the actual travel date.
- Recruit qualified blind reviewers; freeze rubrics, prompts, exclusions, route risk
  policy, datasets, grouped splits, model/adapter hashes, and metrics before the main
  experiment.
- Collect the target datasets with consent, run leakage checks, train the adapter
  manually, execute all A-E conditions, preserve failures/nulls, and publish negative
  as well as positive findings.
- Complete a Mongolia-specific legal, accessibility, safety, incident-response, and
  emergency-language review. R0-R4 is an internal research classification, not an
  official government designation or safety clearance.

## Future scale work

- Replace in-process throttling, metrics, caches, and job coordination with shared
  services; elect one scheduler or use an external job runner.
- Move RAG to a measured PostgreSQL full-text/pgvector or dedicated retrieval index,
  with immutable corpus versions and re-embedding migrations.
- Add OpenTelemetry-compatible traces/metrics, centralized redacted logs, SLOs,
  alerting, synthetic checks, and cost/anomaly budgets.
- Add zero-downtime deployment, migration jobs, canary/rollback policy, image
  vulnerability scanning/signing, dependency review, and disaster recovery tests.
- Perform independent threat modeling and penetration testing, including prompt
  injection, cross-user access, upload malware/polyglots, OAuth account linking,
  SSRF through configured live providers, export re-identification, and admin abuse.
- Complete App Store/Play signing, privacy disclosures, deep-link verification,
  accessibility testing, low-connectivity behavior, and a real-device matrix.
- The existing payment feature is a pilot/manual arrangement. A regulated production
  payment provider, webhook reconciliation, refunds/disputes, tax, and compliance are
  separate work.

## Local demo

The Compose API defaults to port `3000`, while the mobile client's emulator default
uses `3001`. Pick one explicitly. For the current mobile default, add
`BACKEND_PORT=3001` to the local `.env` before starting Compose.

```bash
cp .env.example .env
docker compose config
docker compose up --build -d postgres backend
docker compose exec backend npm run prisma:seed
curl -fsS http://127.0.0.1:3001/api/v1/health/ready

cd frontend
npm ci
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:3001/api/v1 npm start
```

`prisma:seed` is demo-only. Do not run it against a production database.

## Staging migration and release rehearsal

Run migrations as a one-off step before starting the new application version. Do
not let every replica race to perform release migrations.

```bash
cd backend
npm ci
npm run prisma:generate
npx prisma validate
npm run prisma:deploy
npm run build
npm run lint
```

Then start the staged artifact and check both liveness and database readiness:

```bash
curl -fsS https://staging-api.example/api/v1/health/live
curl -fsS https://staging-api.example/api/v1/health/ready
```

With a short-lived admin token stored outside shell history:

```bash
curl -fsS \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://staging-api.example/api/v1/operations/metrics

curl -fsS -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://staging-api.example/api/v1/operations/jobs/expiry/run
```

Also verify authentication, one assistant request in each enabled experiment mode,
source ingestion/review, route validation, R3/R4 review, evidence upload/download,
blind assessment review, guide hard gates, booking draft/submit, export disabled and
enabled states, provider timeout, and a mobile device session.

## Automated validation

Use an isolated database whose name contains `elch_test` for integration tests.

```bash
cd backend
npm ci
npm run prisma:generate
npx prisma validate
npm run lint
npm run build
NODE_ENV=test DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/elch_test?schema=public' npm run prisma:deploy
NODE_ENV=test DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/elch_test?schema=public' npm run test:integration

cd ../frontend
npm ci
npm run export:android

cd ..
python3 -m compileall -q research/scripts research/training research/tests
python3 -m unittest discover -s research/tests -v
```

CI is the release floor, not the complete acceptance test. Keep the test database
physically separate from all development, staging, and production data.

## Backup, restore, and rollback gate

Before the first production migration and before every destructive schema change:

1. Produce an encrypted database backup and private-object inventory.
2. Restore both into an isolated environment.
3. Run readiness plus representative owner/admin flows against the restore.
4. Record recovery point and recovery time results.
5. Document whether application rollback is compatible with the migrated schema.

Example single-host Compose backup, written to a protected local directory:

```bash
install -d -m 700 backups
docker compose exec -T postgres sh -c \
  'pg_dump --format=custom --no-owner --no-acl -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  > "backups/elch-$(date -u +%Y%m%dT%H%M%SZ).dump"
```

Restore into a newly created, isolated database; never rehearse a restore over the
source database. Object storage needs a separate versioned backup/restore exercise.

## Final go/no-go record

The release owner must record the Git SHA and dirty state, image digest/SBOM, schema
migration, environment/config hash without secret values, database backup ID,
restore rehearsal, source/corpus version, route/risk-policy version, model and
adapter IDs/hashes, prompt/rubric version, experiment configuration, CI URL, device
matrix, privacy/security/legal approvals, known exceptions, approvers, and rollback
decision. No chat response or validator result is a real-world booking or safety
approval.
