import { Product } from '../product/product.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cname: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product;
}
