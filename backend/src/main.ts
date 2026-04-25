import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ErrorFilter } from './common/filters/error.filter';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { urlencoded, json } from 'express';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  // Register global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Enable CORS for localhost:3000 only
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL!,
      // add more URLs as needed
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Register global error filter
  app.useGlobalFilters(new ErrorFilter());

  // Register global AuthGuard (all APIs protected by default)
  app.useGlobalGuards(
    new JwtAuthGuard(app.get(Reflector)),
    new RolesGuard(new Reflector()),
  );

  // add global prefix for all routes
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT);
}
bootstrap();
