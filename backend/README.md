# ELCH backend

NestJS REST API with Prisma 7, PostgreSQL, JWT access/refresh sessions, refresh-token rotation, bcrypt password hashing, role-based authorization scaffolding, Swagger, global validation, exception normalization, rate limiting, pagination, and soft-delete-ready data models.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Copy the root `.env.example` to `.env` when running outside Docker and adjust `DATABASE_URL` so it points to `localhost` rather than the Compose service name.

Email verification delivery uses Resend. Configure `RESEND_API_KEY`, `EMAIL_FROM`,
and `EMAIL_VERIFICATION_URL` (for the mobile app, `elch://verify-email`). Raw
verification tokens are never stored or logged.

Password recovery uses the same delivery provider. Configure
`PASSWORD_RESET_URL=elch://reset-password`; reset and password-change actions
revoke every active refresh session.
