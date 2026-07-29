import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import { RankingService } from './ranking.service.js';

@ApiTags('ranking')
@ApiBearerAuth()
@Controller({ path: 'ranking', version: '1' })
export class RankingController {
  constructor(private readonly ranking: RankingService) {}

  @Post('recalculate')
  @Roles(Role.ADMIN)
  recalculate() { return this.ranking.recalculateAll(); }
}
