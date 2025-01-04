import { Entity, OneToOne, JoinColumn, Column, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { TherapistServiceEntity } from "../../therapist-services/entities/therapist-service.entity";
import { TherapistAvailabilityEntity } from "../../therapist-availability/entities/therapist-availability.entity";
import { AppointmentEntity } from "../../appointment/entities/appointment.entity";

@Entity('therapist')
export class TherapistEntity {

  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, { eager: true }) 
  @JoinColumn({ name: 'id' })
  user: UserEntity;

  @Column()
  country: string;

  @Column('simple-array') 
  preferredLanguages: string[];

  @Column()
  preferredCurrency: string;

  @Column()
  timeZone: string;

  @Column()
  officeLocation: string;

  @Column()
  workEmail: string;

  @OneToMany(() => TherapistServiceEntity, (service) => service.therapist, { cascade: true })
  services: TherapistServiceEntity[];

  @OneToMany(() => TherapistAvailabilityEntity, (availability) => availability.therapist, { cascade: true })
  availability: TherapistAvailabilityEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.therapist, { cascade: true })
  appointments: AppointmentEntity[]; 
}
