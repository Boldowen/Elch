import { PrismaService } from '../../prisma/prisma.service.js';
export declare class BookingLifecycleService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    handleCron(): Promise<void>;
    runOnce(now: Date): Promise<{
        transitioned: number;
    }>;
    private transition;
    private inventoryDates;
}
