import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AssistantQueryDto } from './dto/assistant-query.dto.js';
import { ResearchAssistantService } from './research-assistant.service.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { RequestUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('research-assistant')
@Controller({ path: 'research-assistant', version: '1' })
export class ResearchAssistantController {
  constructor(private readonly assistant: ResearchAssistantService) {}

  @Post('query')
  @ApiOperation({ summary: 'Run the grounded intent/retrieval/RouteGraph assistant pipeline' })
  query(@CurrentUser() user: RequestUser, @Body() dto: AssistantQueryDto) {
    return this.assistant.send(user.sub, dto, { roles: user.roles });
  }

  @Post('stream')
  @ApiOperation({ summary: 'Stream a grounded assistant response as server-sent events' })
  @ApiProduces('text/event-stream')
  async stream(
    @CurrentUser() user: RequestUser,
    @Body() dto: AssistantQueryDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    response.status(200);
    response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache, no-transform');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('X-Accel-Buffering', 'no');
    response.flushHeaders();
    const abort = new AbortController();
    let closed = false;
    request.once('close', () => {
      closed = true;
      abort.abort();
    });
    const write = (event: string, data: unknown) => {
      if (closed || response.writableEnded) return;
      response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };
    write('start', { protocol: 'elch-assistant-sse-v1' });
    try {
      const result = await this.assistant.send(user.sub, dto, {
        roles: user.roles,
        abortSignal: abort.signal,
        onDelta: (delta) => write('delta', { delta }),
      });
      write('result', result);
      write('done', { done: true });
    } catch {
      if (!abort.signal.aborted) {
        write('error', {
          code: 'ASSISTANT_STREAM_FAILED',
          message: 'The assistant stream could not be completed',
        });
      }
    } finally {
      if (!response.writableEnded) response.end();
    }
  }

  @Get('conversations')
  conversations(@CurrentUser() user: RequestUser) { return this.assistant.listConversations(user.sub); }

  @Get('conversations/:id')
  conversation(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.assistant.conversation(user.sub, id); }
}
