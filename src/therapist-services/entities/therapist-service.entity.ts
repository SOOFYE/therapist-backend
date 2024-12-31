import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TherapistEntity } from "../../therapist/entities/therapist.entity";

@Entity('therapist_services')
export class TherapistServiceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column('decimal')
    price: number;
  
    @ManyToOne(() => TherapistEntity, (therapist) => therapist.services)
    therapist: TherapistEntity;
}
