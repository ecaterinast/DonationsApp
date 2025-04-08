import { Product } from "./product";

export interface Banner{
    id : string;
    imageURL : string;
    product : Product;
    productId : string;
    categoryId : string;
    brandId : string; 
}