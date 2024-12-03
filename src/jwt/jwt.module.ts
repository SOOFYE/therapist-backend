import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  providers: [JwtAuthService,JwtStrategy],
  exports: [JwtAuthService, JwtModule], 
})
export class JwtAuthModule {}