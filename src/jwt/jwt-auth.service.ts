import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { ConfigService } from "@nestjs/config";
import { ErrorHttpException } from "../common/errors/error-http.exception";



@Injectable()

export class JwtAuthService {
    
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
        
    ){}


    public generateAccessToken(payload: JwtPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.JWT_SECRET'),
            expiresIn: this.configService.get<string>('jwt.JWT_EXPIRATION_TIME')
        });
    }

    public generateNewRefreshToken(refreshToken: string): string {
        try {
          const payload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('jwt.JWT_SECRET'), 
          });
          const newAccessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.JWT_SECRET'),
            expiresIn: this.configService.get<string>('jwt.JWT_EXPIRATION_TIME'),
          });
          return newAccessToken;
        } catch (error) {
          throw new ErrorHttpException(
            HttpStatus.UNAUTHORIZED,
            'Invalid or expired refresh token.',
            'Unauthorized',
            error,
          );
        }
      }
}