import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Unique,
    OneToMany
} from 'typeorm';

import User from './User';
import Image from './Image';

@Entity('products')
@Unique(['trackerNumber'])
export default class Product {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    trackerNumber: string;

    @Column()
    destinationName: string;

    @Column()
    description: string;

    @Column()
    observation: string;

    @Column()
    status: string;

    @OneToMany(() => Image, image => image.product, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'product_id' })
    images: Image[];

    @ManyToOne(() => User, user => user.products)
    @JoinColumn({ name: 'user_id' })
    user: User;
}