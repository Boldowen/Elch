import 'reflect-metadata';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true, bodyParser: false });
    const config = app.get(ConfigService);
    app.enableShutdownHooks();
    app.useBodyParser('json', { limit: `${Math.ceil(config.get('STORAGE_MAX_FILE_BYTES', 5_242_880) * 1.4)}b` });
    app.useBodyParser('urlencoded', { limit: '1mb', extended: true });
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.use(helmet());
    app.use(compression());
    app.enableCors({
        origin: config.get('CORS_ORIGINS', '').split(',').filter(Boolean),
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    const swaggerConfig = new DocumentBuilder()
        .setTitle('ELCH API')
        .setDescription('REST API for the ELCH traveler and local-guide marketplace')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
    await app.listen(config.get('PORT', 3000), '0.0.0.0');
}
void bootstrap();
//# sourceMappingURL=main.js.map