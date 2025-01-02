import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TherapistEntity } from '../../therapist/entities/therapist.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RoleEnum } from '../../user/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import { DayOfWeekEnum } from '../../therapist-availability/enum/days-of-week.enum';
import { TherapistAvailabilityEntity } from '../../therapist-availability/entities/therapist-availability.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TherapistEntity)
    private readonly therapistRepository: Repository<TherapistEntity>,
    @InjectRepository(TherapistAvailabilityEntity)
    private readonly therapistAvailabilityRepository: Repository<TherapistAvailabilityEntity>,
  ) {}




  async seedTherapistAccount(): Promise<void> {
    const therapistConfig = this.configService.get('therapist');
  
    const existingUser = await this.userRepository.findOne({
      where: { email: therapistConfig.email },
    });
  
    if (existingUser) {
      console.log('Therapist account already exists');
      return;
    }
  
    const hashedPassword = await bcrypt.hash(therapistConfig.password, 10);
  
    const therapistUser = this.userRepository.create({
      firstName: therapistConfig.firstName.toString() || null,
      middleName: therapistConfig.middleName.toString()|| null,
      lastName: therapistConfig.lastName.toString()|| null,
      email: therapistConfig.email.toString()|| null,
      phoneNumber: therapistConfig.phoneNumber.toString(),
      password: hashedPassword,
      dob: new Date(therapistConfig.dob),
      role: RoleEnum.therapist,
    });
  
    const savedUser = await this.userRepository.save(therapistUser);
  
    const therapist = this.therapistRepository.create({
      id: savedUser.id, 
      user: savedUser,
      country: therapistConfig.country,
      preferredLanguages: therapistConfig.preferredLanguages,
      preferredCurrency: therapistConfig.preferredCurrency,
      timeZone: therapistConfig.timeZone,
      officeLocation: therapistConfig.officeLocation,
      workEmail: therapistConfig.workEmail,
    });
  
    await this.therapistRepository.save(therapist);
  
    console.log('Therapist account seeded successfully');
  }

  async seedTherapistAvailability(): Promise<void> {
    const therapistEmail = this.configService.get<string>('therapist.email');
  
    // Find the user by email
    const user = await this.userRepository.findOne({
      where: { email: therapistEmail },
    });
  
    if (!user) {
      throw new Error(`User with email ${therapistEmail} not found`);
    }
  
    // Use the user ID to find the therapist
    const therapist = await this.therapistRepository.findOne({
      where: { user: { id: user.id } },
    });
  
    if (!therapist) {
      throw new Error(`Therapist linked to user with email ${therapistEmail} not found`);
    }
  
    const daysOfWeek: { dayOfWeek: DayOfWeekEnum; startTime: string; endTime: string; isActive: boolean }[] = [
      { dayOfWeek: DayOfWeekEnum.Monday, startTime: '09:00:00', endTime: '17:00:00', isActive: true },
      { dayOfWeek: DayOfWeekEnum.Tuesday, startTime: '09:00:00', endTime: '17:00:00', isActive: true },
      { dayOfWeek: DayOfWeekEnum.Wednesday, startTime: '09:00:00', endTime: '17:00:00', isActive: true },
      { dayOfWeek: DayOfWeekEnum.Thursday, startTime: '09:00:00', endTime: '17:00:00', isActive: true },
      { dayOfWeek: DayOfWeekEnum.Friday, startTime: '09:00:00', endTime: '17:00:00', isActive: true },
      { dayOfWeek: DayOfWeekEnum.Saturday, startTime: '00:00:00', endTime: '00:00:00', isActive: false },
      { dayOfWeek: DayOfWeekEnum.Sunday, startTime: '00:00:00', endTime: '00:00:00', isActive: false },
    ];
  
    const availabilityEntities = daysOfWeek.map((day) =>
      this.therapistAvailabilityRepository.create({ ...day, therapist }),
    );
  
    await this.therapistAvailabilityRepository.save(availabilityEntities);
  
    console.log('Therapist availability seeded successfully');
  }


}