import { CanActivate, Controller, ExecutionContext, Injectable, Module, NotFoundException, Get } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants.js';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Public } from '../../common/decorators/public.decorator.js';

@Injectable()
export class FeaturesService {
  constructor(private readonly config: ConfigService) {}

  snapshot() {
    return {
      community: this.enabled('FEATURE_COMMUNITY_ENABLED', false),
      reviews: this.enabled('FEATURE_REVIEWS_ENABLED', true),
      guideRanking: this.enabled('FEATURE_GUIDE_RANKING_ENABLED', false),
      // These require a production implementation before they can be enabled.
      imageUpload: false,
      onlinePayment: false,
    };
  }

  private enabled(name: string, fallback: boolean) {
    const value = this.config.get<boolean | string>(name, fallback);
    return value === true || value === 'true';
  }
}

@Injectable()
export class FeaturesGuard implements CanActivate {
  constructor(private readonly features: FeaturesService, private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    if (context.getType() !== 'http') return true;
    const controllerPath = this.reflector.get<string>(PATH_METADATA, context.getClass());
    const methodPath = this.reflector.get<string>(PATH_METADATA, context.getHandler());
    const feature = controllerPath === 'social' ? 'community'
      : controllerPath === 'reviews' ? 'reviews'
        : controllerPath === 'ranking' || (controllerPath === 'guides' && methodPath === 'ranking') ? 'guideRanking'
          : null;
    if (feature && !this.features.snapshot()[feature]) {
      throw new NotFoundException({ code: 'FEATURE_DISABLED', message: 'This feature is not available in this release' });
    }
    return true;
  }
}

@Controller({ path: 'features', version: '1' })
export class FeaturesController {
  constructor(private readonly features: FeaturesService) {}

  @Public()
  @Get()
  list() { return this.features.snapshot(); }
}

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesService, { provide: APP_GUARD, useClass: FeaturesGuard }],
  exports: [FeaturesService],
})
export class FeaturesModule {}
