import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user';
import { AGEmail } from './agEmails';

@Entity()
export class AG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  agenda: string;

  @OneToMany(() => AGEmail, agEmail => agEmail.ag, { cascade: true })
  emails: AGEmail[];

  @Column({ nullable: true })
  link: string;

  @ManyToOne(() => User, user => user.ags)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    id: number,
    title: string,
    date: string,
    time: string,
    agenda: string,
    emails: AGEmail[],
    link: string, 
    createdBy: User,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.time = time;
    this.agenda = agenda;
    this.emails = emails;
    this.link = link; 
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
