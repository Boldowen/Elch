# VenTour backend

NestJS REST API with Prisma 7, PostgreSQL, JWT access/refresh sessions, refresh-token rotation, bcrypt password hashing, role-based authorization scaffolding, Swagger, global validation, exception normalization, rate limiting, pagination, and soft-delete-ready data models.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Copy the root `.env.example` to `.env` when running outside Docker and adjust `DATABASE_URL` so it points to `localhost` rather than the Compose service name.
