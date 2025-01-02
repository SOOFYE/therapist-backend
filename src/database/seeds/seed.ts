import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);

  console.log('Starting seed process...');


  await seedService.seedTherapistAccount();
  await seedService.seedTherapistAvailability();
  //await seedService.seedSuperAdminAccount();

  console.log('Seeding complete!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});