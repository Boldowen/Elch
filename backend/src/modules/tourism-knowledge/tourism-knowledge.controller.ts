import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/client.js';
import { CurrentUser, type RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import {
  CreateTourismSourceDto,
  IngestTourismKnowledgeDto,
  ListTourismSourcesDto,
  ReviewTourismKnowledgeDto,
  ReviewTourismSourceDto,
  SearchTourismKnowledgeDto,
} from './dto/tourism-knowledge.dto.js';
import { TourismIngestionService } from './tourism-ingestion.service.js';
import { TourismRetrievalService } from './tourism-retrieval.service.js';

@ApiTags('tourism-knowledge')
@ApiBearerAuth()
@Controller({ path: 'tourism-knowledge', version: '1' })
export class TourismKnowledgeController {
  constructor(private readonly ingestion: TourismIngestionService, private readonly retrieval: TourismRetrievalService) {}

  @Post('search') search(@Body() dto: SearchTourismKnowledgeDto) { return this.retrieval.search(dto); }
  @Roles(Role.ADMIN) @Get('sources') sources(@Query() dto: ListTourismSourcesDto) { return this.ingestion.listSources(dto); }
  @Roles(Role.ADMIN) @Get('sources/:id') source(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) { return this.ingestion.getSource(id); }
  @Roles(Role.ADMIN) @Post('sources') createSource(@Body() dto: CreateTourismSourceDto) { return this.ingestion.createSource(dto); }
  @Roles(Role.ADMIN) @Patch('sources/:id/review') reviewSource(
    @CurrentUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ReviewTourismSourceDto,
  ) { return this.ingestion.reviewSource(user.sub, id, dto); }
  @Roles(Role.ADMIN) @Patch('knowledge/:id/review') reviewKnowledge(
    @CurrentUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ReviewTourismKnowledgeDto,
  ) { return this.ingestion.reviewKnowledge(user.sub, id, dto); }
  @Roles(Role.ADMIN) @Post('ingest') ingest(@Body() dto: IngestTourismKnowledgeDto) { return this.ingestion.ingest(dto); }
}
