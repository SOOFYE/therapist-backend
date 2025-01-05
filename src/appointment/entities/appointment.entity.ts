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

  @ManyToOne(() => TherapistEntity, (therapist) => therapist.appointments)
  @JoinColumn()
  therapist: TherapistEntity;

  @ManyToOne(() => TherapistServiceEntity, { nullable: false })
  @JoinColumn()
  service: TherapistServiceEntity;

  @ManyToOne(() => ClientEntity, (client) => client.appointments)
  client: ClientEntity;

  @OneToOne(() => SessionRecordEntity, (sessionRecord) => sessionRecord.appointment)
  @JoinColumn() 
  sessionRecord: SessionRecordEntity; 
}
