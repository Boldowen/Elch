import 'dotenv/config';
import { defineConfig } from 'prisma/config';
export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL ?? 'postgresql://ventour:ventour_change_me@localhost:5432/ventour?schema=public',
    },
});
//# sourceMappingURL=prisma.config.js.map