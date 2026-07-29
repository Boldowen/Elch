import { RankingService } from './ranking.service.js';
export declare class RankingController {
    private readonly ranking;
    constructor(ranking: RankingService);
    recalculate(): Promise<{
        recalculated: number;
    }>;
}
