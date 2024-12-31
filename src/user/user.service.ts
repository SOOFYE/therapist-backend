import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}


  async create(createUserDto:CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }


  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }


  async findOne(where: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where });
    return user;
  }


  async update(id: string, updateUserDto: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.findOne({id}); 
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }




}
