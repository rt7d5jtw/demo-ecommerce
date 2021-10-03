import { BaseEntity } from 'typeorm';
export declare class Promotion extends BaseEntity {
    id: number;
    title: string;
    url: string;
    image: string;
}
