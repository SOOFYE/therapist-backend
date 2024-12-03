import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('error_logs')
export class ErrorLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  statusCode: number;

  @Column()
  message: string;

  @Column()
  error: string;

  @Column('json', { nullable: true })
  errorDetails: any;

  @Column()
  controller: string; 

  @Column()
  method: string; 

  @Column()
  ipAddress: string; 

  @Column()
  timestamp: Date; 
}