import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { AppointmentEntity } from "../../appointment/entities/appointment.entity";

@Entity('clients')
export class ClientEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => UserEntity, (user) => user.clients)
    user: UserEntity;
    
    @OneToMany(() => AppointmentEntity, (appointment) => appointment.client, { cascade: true })
    appointments: AppointmentEntity[]; 
  }
