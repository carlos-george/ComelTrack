import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn
} from 'typeorm';

import Product from './Product';
import UserRole from './UsersRoles';

@Entity('users')
export default class Users {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @OneToMany(() => Product, product => product.user, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'user_id' })
    products: Product[];

    @OneToMany(() => UserRole, userrole => userrole.user, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'user_id' })
    usersroles: UserRole[];

}