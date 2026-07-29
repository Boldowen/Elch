import { PaymentArrangement, PaymentStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProposePaymentArrangementDto } from './dto/payment-arrangement.dto.js';
export declare class PaymentArrangementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    propose(userId: string, bookingId: string, dto: ProposePaymentArrangementDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: PaymentStatus;
        bookingId: string;
        arrangement: PaymentArrangement;
        instructions: string | null;
        proposedById: string;
        agreedByTravelerAt: Date | null;
        agreedByProviderAt: Date | null;
        paidAt: Date | null;
    }>;
    agree(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: PaymentStatus;
        bookingId: string;
        arrangement: PaymentArrangement;
        instructions: string | null;
        proposedById: string;
        agreedByTravelerAt: Date | null;
        agreedByProviderAt: Date | null;
        paidAt: Date | null;
    }>;
    markPaid(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: PaymentStatus;
        bookingId: string;
        arrangement: PaymentArrangement;
        instructions: string | null;
        proposedById: string;
        agreedByTravelerAt: Date | null;
        agreedByProviderAt: Date | null;
        paidAt: Date | null;
    } | null>;
    private participant;
}
