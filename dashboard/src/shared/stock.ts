import { Product } from './product';

export interface Stock{
    id? : string;
    productId : string;
    name : string;
    stock : number;
    product? : Product
}