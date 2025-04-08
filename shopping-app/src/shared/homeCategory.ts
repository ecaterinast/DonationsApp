import { Category } from './category';
import { Product } from './product';

export interface HomeCategory{
    products: Product[];
    id? : string;
    categoryId : string;
    categories? : Category;
}