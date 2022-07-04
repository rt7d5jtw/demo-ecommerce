import { Product } from '../product/product.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany
} from 'typeorm';

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* category name */
  @Column()
  cname: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
