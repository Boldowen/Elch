/**
 * One-off live check of the Claude integration (no database needed; uses the
 * in-memory RouteGraph). Makes three small paid requests.
 *
 *   cd backend && npm run ai:smoke
 */
import { ConfigService } from '@nestjs/config';
import { AnthropicAiProvider } from '../src/modules/ai/anthropic/anthropic.provider.js';
import { ClaudeAssistantRuntime } from '../src/modules/ai/anthropic/claude-assistant.runtime.js';
import { ClaudeMessagesService, createAnthropicClient, describeAnthropicError } from '../src/modules/ai/anthropic/claude-messages.service.js';
import { EmbeddingService } from '../src/modules/ai/embedding.service.js';
import { ModelRouterService } from '../src/modules/ai/model-router.service.js';
import { ToolRegistryService } from '../src/modules/ai/tools/tool-registry.service.js';
import { RoutePlanningService } from '../src/modules/route-planning/route-planning.service.js';

const env = Object.fromEntries(Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined));
const config = new ConfigService({ ...env, AI_PROVIDER: 'anthropic' });
const client = createAnthropicClient(config);
if (!client) {
  console.error('ANTHROPIC_API_KEY is not set in the repository .env file.');
  process.exit(1);
}

const messages = new ClaudeMessagesService(config, client);
const router = new ModelRouterService(config);
const provider = new AnthropicAiProvider(config, messages, router, new EmbeddingService(config));
const registry = new ToolRegistryService({} as never, new RoutePlanningService(), {} as never);
const runtime = new ClaudeAssistantRuntime(config, messages, registry);

try {
  const intent = await provider.classifyRequest('Говийн маршрутаар 7 хоногийн аялал төлөвлөж өгөөч');
  console.log('1. classifyRequest ->', intent);

  const model = router.forRole('advanced');
  const stableSystem = 'You are a Mongolia tourism research assistant. Use the declared tools for route facts; never invent prices, availability or safety clearance.';
  for (const [index, question] of ['Which research routes cover the Gobi? Summarize the risk class and recommended days.', 'Now list the main stops on that Gobi route.'].entries()) {
    process.stdout.write(`${index + 2}. runtime (${model.ref}) -> `);
    const result = await runtime.run({
      model,
      stableSystem,
      volatileSystem: 'Reply in English. Verified context: {}',
      messages: [{ role: 'user', content: question }],
      useTools: true,
      maxToolRounds: 2,
      context: { userId: 'smoke-test', roles: ['TRAVELER'] },
      onDelta: (delta) => { process.stdout.write(delta); },
    });
    console.log(`\n   tools=${JSON.stringify(result.toolTrace.map((item) => `${item.name}:${item.status}`))} finish=${result.finishReason}`);
    console.log(`   usage=${JSON.stringify(result.usage)}`);
  }
} catch (error) {
  const cause = (error as { cause?: unknown }).cause;
  console.error('\nFAILED:', error instanceof Error ? error.message : error);
  console.error('Anthropic API said:', describeAnthropicError(cause) ?? describeAnthropicError(error) ?? cause);
  process.exit(1);
}
console.log('\nA non-zero cacheReadInputTokens on request 3 confirms prompt caching of the tools + stable system prompt.');
