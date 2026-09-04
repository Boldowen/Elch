# Validation protocol

The former July 2026 Flutter/stub report no longer describes this repository. The
current client is Expo React Native, Prisma generation and real PostgreSQL migrations
are required, and a temporary ORM stub is not acceptable release evidence.

Use the exact backend, integration, mobile, and research commands in
[docs/LAUNCH_READINESS.md](docs/LAUNCH_READINESS.md). GitHub Actions runs the same
release floor on pushes and pull requests. A release record must link the actual CI
run and staging acceptance evidence; this file intentionally does not preserve stale
"passed" claims.

At minimum, validate schema generation, all committed migrations against a fresh
`elch_test` database, lint, TypeScript build, the full Jest integration command, Expo
Android export, Python research tests, container health/readiness, and the protected
end-to-end flows listed in the runbook. iOS and real-device behavior remain manual
release gates unless a dedicated CI runner is added.
