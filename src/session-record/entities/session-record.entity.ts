import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { AppointmentEntity } from "../../appointment/entities/appointment.entity";

@Entity('session_records')
export class SessionRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AppointmentEntity, (appointment) => appointment.id, { onDelete: 'CASCADE' })
  appointment: AppointmentEntity;

  @Column({ nullable: true })
  zoomMeetingLink: string;

  @Column({ nullable: true })
  meetingId: string;

  @Column({ nullable: true })
  sessionAudioUrl: string;
    
  @Column({ nullable: true })
  transcriptionUrl: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  transcription: string;

  @Column({ type: 'text', nullable: true })
  meetingSummary: string;
}