import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "../enums/role.enum";
import { TherapistEntity } from "../../therapist/entities/therapist.entity";
import { ClientEntity } from "../../client/entities/client.entity";


@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({type: String})
    firstName: string;
  
    @Column({type: String, nullable: true })
    middleName?: string;
  
    @Column({type: String})
    lastName: string;
  
    @Column({type: String, unique: true })
    email: string;
  
    @Column({type: String})
    phoneNumber: string;
  
    @Column({type: String, nullable: true })
    password?: string;

    @Column()
    dob: Date;

    @Column({ type: 'enum', enum: RoleEnum })
    role: RoleEnum;

    @OneToOne(() => TherapistEntity, (therapist) => therapist.user, { nullable: true, cascade: true })
    therapist?: TherapistEntity;
    
    @OneToMany(() => ClientEntity, (client) => client.user, { nullable: true, cascade: true })
    clients?: ClientEntity[];
  
}
