import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import Product from './Product';

@Entity('images')
export default class Image {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    imageKey: string;

    @ManyToOne(() => Product, product => product.images)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}