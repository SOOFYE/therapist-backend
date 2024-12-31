import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TherapistEntity } from "../../therapist/entities/therapist.entity";
import { DayOfWeekEnum } from "../enum/days-of-week.enum";

@Entity('therapist_availability')
export class TherapistAvailabilityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'enum', enum: DayOfWeekEnum })
    dayOfWeek: DayOfWeekEnum;
  
    @Column({ type: 'time' })
    startTime: string;
  
    @Column({ type: 'time' })
    endTime: string;

    @Column({ default: true }) 
    isActive: boolean;
  
    @ManyToOne(() => TherapistEntity, (therapist) => therapist.availability)
    therapist: TherapistEntity;
}
