import { Product } from '../product/product.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cname: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
