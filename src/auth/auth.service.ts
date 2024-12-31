import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../client/entities/client.entity';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { UserEntity } from '../user/entities/user.entity';
import { RoleEnum } from '../user/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { ErrorHttpException } from '../common/errors/error-http.exception';


@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtAuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}



  async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }




  // async clientSignUp(clientData: Partial<UserEntity>): Promise<UserEntity> {
  //   const hashedPassword = await bcrypt.hash(clientData.password, 10);

  //   const user = this.userRepository.create({
  //     ...clientData,
  //     password: hashedPassword,
  //     role: RoleEnum.client,
  //   });

  //   const savedUser = await this.userRepository.save(user);

  //   const client = this.clientRepository.create({
  //     user: savedUser,
  //   });
  //   await this.clientRepository.save(client);

  //   return savedUser;
  // }



  async comparePassword(requestPassword: string, userPassword: string):Promise<Boolean>{

    if(!(await bcrypt.compare(requestPassword, userPassword)))
      return false

    return true
  }



  // async clientSignIn(email: string, password: string): Promise<{ accessToken: string; user: UserEntity }> {


  //   if (!user || !(await bcrypt.compare(password, user.password))) {
  //     throw new ErrorHttpException(HttpStatus.BAD_REQUEST,"User does not exit / Incorrect Password",HttpStatus[HttpStatus.BAD_REQUEST]);
  //   }

  //   const payload = { sub: user.id, role: user.role};
  //   const accessToken = this.jwtService.generateAccessToken(payload);

  //   return { accessToken, user };
  // }

  async therapistSignIn(email: string, password: string): Promise<{ accessToken: string; user: UserEntity }> {
    const user = await this.userRepository.findOne({
      where: { email, role: RoleEnum.therapist },
      relations: ['therapist'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ErrorHttpException(HttpStatus.BAD_REQUEST,"User does not exit / Incorrect Password",HttpStatus[HttpStatus.BAD_REQUEST]);
    }

    const payload = { sub: user.id, role: user.role};
    const accessToken = this.jwtService.generateAccessToken(payload);

    return { accessToken, user };
  }




  async createClientByTherapist(
    clientData: Partial<UserEntity>,
  ): Promise<{setupLink: string, savedClientUser: UserEntity}> {
   
    const clientUser = this.userRepository.create({
      ...clientData,
      role: RoleEnum.client,
      password: null, 
    });
  
    const savedClientUser = await this.userRepository.save(clientUser);
   
    const clientEntity = this.clientRepository.create({
      user: savedClientUser,
    });
  
    await this.clientRepository.save(clientEntity);
  
    const token = this.jwtService.generateAccessToken(
      {role: savedClientUser.role, sub: savedClientUser.id }
    );
  
    const setupLink = `${process.env.FRONTEND_URL}/auth/setup-password?token=${token}`;


    return {setupLink, savedClientUser}

  }




  async setupPassword(setupData ){

    const payload = this.jwtService.verifyToken(setupData.token);
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });

    if (!user) {
      throw new Error('Invalid token or user not found');
    }


    user.password = await bcrypt.hash(setupData.password, 10);
    await this.userRepository.save(user);
  
    return { message: 'Password set successfully' };
  }
  
   



}
