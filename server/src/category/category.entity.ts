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
  @Column({
    unique: true,
    name: 'id',
    primary: true,
    nullable: false,
    type: 'uuid'
  })
  id: string;

  /* category name */
  @Column({
    name: 'cname',
    nullable: false,
    length: 255,
    type: 'varchar'
  })
  cname: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
