import { Variable } from './variable';
import { Stock } from './stock';



export interface Product{
  marketId: string;
	id : string;
	name : string;
	description : string;
	image : string;
	price : number;
	createdAt : number;
	amount : number; 
	subcategoryId? : string;
	categoryId? : string;
	subcategory? : any;
	variables? : Variable[];
	stock : number;
	stocks? : Stock[];
}