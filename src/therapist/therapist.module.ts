import { Module } from '@nestjs/common';
import { TherapistService } from './therapist.service';
import { TherapistController } from './therapist.controller';
import { TherapistEntity } from './entities/therapist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard';
import { JwtAuthModule } from '../jwt/jwt.module';


@Module({
  imports:[JwtAuthModule,UserModule,TypeOrmModule.forFeature([TherapistEntity])],
  controllers: [TherapistController],
  providers: [TherapistService],
  exports: [TherapistService],
})
export class TherapistModule {}
