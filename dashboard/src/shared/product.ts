import { Rating } from './rating'
import { Variable } from './variable';
import { Stock } from './stock';



export interface Product{
	id : string;
	name : string;
	description : string;
	image : string;
	price : number;
	ratings : Rating[];
	createdAt : number;
	subcategoryId? : string;
	categoryId? : string;
	subcategory? : any;
	variables? : Variable[];
	orderedVariables? : any;
	stock : number;
	stocks? : Stock[];
	discount? : number;
	available? : boolean;
	featured : boolean;
	brandId? : string;
	gallery : string[]
}