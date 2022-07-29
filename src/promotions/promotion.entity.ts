import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promotions')
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Column({
    unique: true,
    name: 'id',
    primary: true,
    nullable: false,
    type: 'int'
  })
  id: number;

  @Column({ name: 'title', nullable: false, length: 255, type: 'varchar' })
  title: string;

  @Column({ name: 'url', nullable: false, length: 255, type: 'varchar' })
  url: string;

  @Column({ name: 'image', nullable: false, length: 255, type: 'varchar' })
  image: string;
}
