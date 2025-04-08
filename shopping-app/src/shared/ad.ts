import { Product } from "./product";

export interface Ad{
    id : string;
    imageURL : string;
    product : Product;
    productId : string;
    categoryId : string;
    brandId : string; 
}