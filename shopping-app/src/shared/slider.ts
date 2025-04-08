import { Product } from "./product";

export interface Slider{
    id : string;
    imageURL : string;
    product : Product;
    productId : string;
    categoryId : string;
    brandId : string; 
}