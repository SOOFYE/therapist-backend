import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { ClientSignUpDto } from './dto/client-signup.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { SetupPasswordDto } from './dto/setup-password.dto';
import { UserService } from '../user/user.service';
import { RoleEnum } from '../user/enums/role.enum';
import { ClientEntity } from '../client/entities/client.entity';
import { ClientService } from '../client/client.service';
import { ErrorHttpException } from '../common/errors/error-http.exception';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { SuccessResponse } from '../common/sucesses/success-http.response';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly jwtService: JwtAuthService,

  ) {}

  @Post('client/signup')
  @ApiOperation({ summary: 'Client Sign-Up' })
  async clientSignUp(@Body() clientData: ClientSignUpDto): Promise<SuccessResponse<{accessToken: string, user: UserEntity}>> {

    console.log(clientData)

    try {
      if (await this.userService.findOne({ email: clientData.email })) {
        throw new ErrorHttpException(
          HttpStatus.BAD_REQUEST,
          'User with this email already exists',
          'Duplicate Records',
          null,
        );
      }
  
      const clientPassword = await this.authService.generateHashedPassword(clientData.password);
  
      const user: UserEntity = await this.userService.create({
        firstName: clientData.firstName,
        middleName: clientData?.middleName,
        lastName: clientData.lastName,
        email: clientData.email,
        phoneNumber: clientData.phoneNumber,
        password: clientPassword,
        dob: clientData.dob,
        role: RoleEnum.client,
      });

      console.log(user)

      const client: ClientEntity = await this.clientService.create({
        id: user.id, 
        user,
      });
  
      const payload = { sub: user.id, role: user.role}; 
      const accessToken = this.jwtService.generateAccessToken(payload);
  
      return new SuccessResponse(HttpStatus.CREATED, 'Client account created successfully', {accessToken: accessToken,user: user});
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        //console.log(error);
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred',
          'Internal Server Error',
          error.message,
        );
      }
  
      throw error;
    }
  }

  @Post('client/signin')
@ApiOperation({ summary: 'Client Sign-In' })
async clientSignIn(@Body() loginData: LoginDto): Promise<SuccessResponse<{ accessToken: string; user: UserEntity }>> {
  try {
    const user: UserEntity = await this.userService.findOne({ email: loginData.email });

    if (!user) {
      throw new ErrorHttpException(
        HttpStatus.NOT_FOUND,
        'User with this email does not exist',
        'Not Found',
        null,
      );
    }

    if (!await this.authService.comparePassword(loginData.password, user?.password)) {
      throw new ErrorHttpException(
        HttpStatus.BAD_REQUEST,
        'Incorrect email/password',
        'Authentication Failed',
        null,
      );
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.generateAccessToken(payload);

    return new SuccessResponse(HttpStatus.OK, 'Client logged in successfully', { accessToken, user });
  } catch (error) {
    if (!(error instanceof ErrorHttpException)) {
      console.log(error);
      throw new ErrorHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred',
        'Internal Server Error',
        error.message,
      );
    }

    throw error;
  }
}

@Post('therapist/signin')
@ApiOperation({ summary: 'Therapist Sign-In' })
async therapistSignIn(@Body() loginData: LoginDto): Promise<SuccessResponse<{ accessToken: string; user: UserEntity }>> {
  try {
    const user: UserEntity = await this.userService.findOne({ email: loginData.email, role: RoleEnum.therapist });

    if (!user) {
      throw new ErrorHttpException(
        HttpStatus.NOT_FOUND,
        'Therapist with this email does not exist',
        'Not Found',
        null,
      );
    }

    if (!await this.authService.comparePassword(loginData.password, user.password)) {
      throw new ErrorHttpException(
        HttpStatus.BAD_REQUEST,
        'Incorrect email/password',
        'Authentication Failed',
        null,
      );
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.generateAccessToken(payload);

    return new SuccessResponse(HttpStatus.OK, 'Therapist logged in successfully', { accessToken, user });
  } catch (error) {
    if (!(error instanceof ErrorHttpException)) {
      console.log(error);
      throw new ErrorHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred',
        'Internal Server Error',
        error.message,
      );
    }

    throw error;
  }
}



// @Post('therapist/create-client')
// @ApiOperation({ summary: 'Therapist creates a client' })
// async createClientByTherapist(
//   @Body() clientData: { firstName: string; middleName?: string; lastName: string; email: string; phoneNumber: string },
// ): Promise<{ message: string }> {
  
//   let {setupLink, savedClientUser} = await this.authService.createClientByTherapist(clientData);
  
//   await this.emailService.sendEmail(
//     savedClientUser.email,
//     'Set Up Your Password',
//     `Click the following link to set up your password: ${setupLink}`,
//     `<p>Click <a href="${setupLink}">here</a> to set up your password.</p>`,
//   );
  
//   return { message: 'Client created and email sent for password setup' };
// }



// @Post('setup-password')
// @ApiOperation({ summary: 'Set up password for a client' })
// async setupPassword(
//   @Body() setupData: SetupPasswordDto,
// ): Promise<{ message: string }> {
//  return this.authService.setupPassword(setupData)
// }




}
