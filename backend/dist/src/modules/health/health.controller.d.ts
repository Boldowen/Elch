import { PrismaService } from '../../prisma/prisma.service.js';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    live(): {
        status: string;
        service: string;
        check: string;
        timestamp: string;
    };
    check(): Promise<{
        status: string;
        service: string;
        check: string;
        database: string;
        timestamp: string;
    }>;
    ready(): Promise<{
        status: string;
        service: string;
        check: string;
        database: string;
        timestamp: string;
    }>;
}
