import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { VoteQuestion } from "./votequestion";
import { VoteResponse } from "./voteResponse";
import "reflect-metadata";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  mode: string;

  @Column()
  majority: string;  

  @Column({ nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  deadline: Date;  

  @ManyToOne(() => User, user => user.id)
  createdBy: User;

  @OneToMany(() => VoteQuestion, question => question.vote, { eager: true, cascade: true })
  questions: VoteQuestion[];

  @OneToMany(() => VoteResponse, response => response.vote)
  responses?: VoteResponse[];

  constructor(id: number, title: string, mode: string, majority: string, comment: string | undefined, createdBy: User, questions: VoteQuestion[], createdAt: Date, updatedAt: Date, deadline: Date) {
    this.id = id;
    this.title = title;
    this.mode = mode;
    this.majority = majority;
    this.comment = comment;
    this.createdBy = createdBy;
    this.questions = questions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deadline = deadline;
  }
}
