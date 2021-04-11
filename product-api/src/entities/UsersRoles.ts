import { PrimaryGeneratedColumn, Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import User from './User';
import Role from './Role';

@Entity('users_roles')
export default class UserRole {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, user => user.usersroles)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Role, role => role.usersroles)
    @JoinColumn({ name: 'role_id' })
    role: Role;
}