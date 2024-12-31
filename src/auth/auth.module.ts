import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthModule } from '../jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ClientEntity } from '../client/entities/client.entity';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { ClientService } from '../client/client.service';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [JwtAuthModule,EmailModule,UserModule,ClientModule,TypeOrmModule.forFeature([UserEntity,ClientEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
