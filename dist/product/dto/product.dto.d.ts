import { ProductStatus } from '../product.entity';
export declare class CreateProductDto {
    title: string;
    price: number;
    image?: string;
    description?: string;
    categoryIds: CategoryIdDto[];
}
declare type CategoryIdDto = {
    id: string;
};
export interface IUpdateProduct extends CreateProductDto {
    status: ProductStatus;
}
export declare type UpdateProductDto = Partial<IUpdateProduct>;
export {};
