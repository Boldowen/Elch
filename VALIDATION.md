# Validation report

Validated on 2026-07-16 in the artifact sandbox.

## Passed

- Parsed `package.json`, `docker-compose.yml`, `pubspec.yaml`, and `analysis_options.yaml`.
- Resolved all relative Dart and TypeScript imports, excluding the intentionally generated Prisma client path.
- Ran a delimiter/string/comment-aware structural scan over all Flutter source files.
- Installed backend dependencies without lifecycle scripts.
- Compiled the NestJS TypeScript source successfully using a temporary permissive Prisma API stub.
- Started the compiled NestJS entry point and received a successful response from `GET /api/v1/health`.
- Confirmed the deliverable does not contain the temporary Prisma stub or `node_modules`.

## Environment-limited checks

- Prisma client generation and schema-engine validation could not finish because the sandbox could not resolve `binaries.prisma.sh`. The Docker build runs `prisma generate` on a normal network before compiling.
- Docker CLI was unavailable, so `docker compose config` and a real PostgreSQL container boot were not executed here. The Compose YAML was parsed successfully.
- Flutter SDK was unavailable, so `flutter analyze`, Android/iOS builds, and device rendering tests must be run locally after `frontend/scripts/bootstrap_platforms.sh` generates platform wrappers.
