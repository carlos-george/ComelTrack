
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';

import UsersRoles from './UsersRoles';

@Entity('roles')
export default class Role {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @OneToMany(() => UsersRoles, userrole => userrole.role, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'role_id' })
    usersroles: UsersRoles[];

}