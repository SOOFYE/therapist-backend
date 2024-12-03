import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());


  const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API documentation for My App')
  .setVersion('1.0')
  .addBearerAuth() // Optional: If using authentication
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('PORT'));
  console.log(`Application is running on: http://localhost:${configService.get<number>('PORT')}`)
  console.log(`Swagger API documentation available at: http://localhost:${configService.get<number>('PORT')}/api`)
}
bootstrap();
