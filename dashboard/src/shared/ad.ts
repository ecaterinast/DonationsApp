import { Brand } from "./brand";
import { Category } from "./category";
import { Product } from "./product";

export interface Ad {
    id?: string;
    productId?: string;
    categoryId?: string;
    brandId?: string;
    product?: Product;
    category?: Category;
    brand?: Brand;
    imageURL : string;
}