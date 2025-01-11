import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { ClientEntity } from "../../client/entities/client.entity";
import { TherapistEntity } from "../../therapist/entities/therapist.entity";
import { AppointmentTypeEnum } from "../enum/appointment-type.enum";
import { SessionRecordEntity } from "../../session-record/entities/session-record.entity";
import { TherapistServiceEntity } from "../../therapist-services/entities/therapist-service.entity";

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string; 

 @Column({ type: 'time' })
  startTime: string; 

  @Column({ type: 'time' })
  endTime: string; 

  @Column({ type: 'enum', enum: AppointmentTypeEnum })
  type: AppointmentTypeEnum; 

  @ManyToOne(() => TherapistEntity, (therapist) => therapist.appointments, { eager: true })
  @JoinColumn()
  therapist: TherapistEntity;

  @ManyToOne(() => TherapistServiceEntity, { nullable: false, eager: true })
  @JoinColumn()
  service: TherapistServiceEntity;

  @ManyToOne(() => ClientEntity, (client) => client.appointments, { eager: true })
  client: ClientEntity;

  @OneToOne(() => SessionRecordEntity, (sessionRecord) => sessionRecord.appointment, { eager: true })
  @JoinColumn() 
  sessionRecord: SessionRecordEntity; 
}
