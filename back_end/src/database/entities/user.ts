import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Token } from "./token";
import { Role } from "./roles";
import "reflect-metadata";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @ManyToOne(() => Role, role => role.users, {eager: true})
    roles: Role;
    ags: any;

    @Column()
    contribution: boolean;

    @Column({ type: 'datetime',nullable: true })
    toUpdateOn: Date;

    constructor(id: number, username: string, email: string, password: string, tokens: Token[], roles: Role,contribution:boolean,toUpdateOn: Date) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.tokens = tokens;
        this.roles = roles;
        this.contribution = contribution;
        this.toUpdateOn = toUpdateOn;
    }
}
