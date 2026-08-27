import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Res, StreamableFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser, type RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import { ReviewGuideEvidenceDto, UploadGuideEvidenceDto } from './dto/guide-evidence.dto.js';
import { GuideEvidenceService } from './guide-evidence.service.js';

@ApiTags('guide-evidence')
@ApiBearerAuth()
@Controller({ path: 'guides', version: '1' })
export class GuideEvidenceController {
  constructor(private readonly evidence: GuideEvidenceService) {}

  @Post('me/evidence')
  upload(@CurrentUser() user: RequestUser, @Body() dto: UploadGuideEvidenceDto) {
    return this.evidence.upload(user.sub, dto);
  }

  @Get('me/evidence')
  mine(@CurrentUser() user: RequestUser) {
    return this.evidence.listMine(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get('evidence/pending')
  pending() {
    return this.evidence.listPending();
  }

  @Roles(Role.ADMIN)
  @Patch('evidence/:id/review')
  review(
    @CurrentUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ReviewGuideEvidenceDto,
  ) {
    return this.evidence.review(user.sub, id, dto);
  }

  @Get('evidence/:id/file')
  async file(
    @CurrentUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const object = await this.evidence.download(user.sub, user.roles, id);
    response.setHeader('content-type', object.contentType);
    response.setHeader('content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent(object.fileName)}`);
    response.setHeader('cache-control', 'private, no-store');
    return new StreamableFile(Buffer.from(object.bytes));
  }
}
