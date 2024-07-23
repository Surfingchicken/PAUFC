import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AG } from './ag';

@Entity()
export class AGEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @ManyToOne(() => AG, ag => ag.emails)
  ag: AG;

  constructor(id: number, email: string, ag: AG) {
    this.id = id;
    this.email = email;
    this.ag = ag;
  }
}
