import { Product } from './product';

export interface Stock{
    id? : string;
    marketId : string;
    productId : string;
    en : string;
    ar : string;
    stock : number;
    product? : Product
}