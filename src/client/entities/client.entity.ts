import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn, OneToOne } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { AppointmentEntity } from "../../appointment/entities/appointment.entity";

@Entity('clients')
export class ClientEntity {

  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, { eager: true }) 
  @JoinColumn({ name: 'id' })
  user: UserEntity;
    
    @OneToMany(() => AppointmentEntity, (appointment) => appointment.client, { cascade: true })
    appointments: AppointmentEntity[]; 
  }
