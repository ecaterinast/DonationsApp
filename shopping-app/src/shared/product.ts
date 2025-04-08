import { Rating } from './rating'


interface Variable {
	key : string,
	values : {
		name : string;
		price : number;
	}[]
}

export interface Product{
  	cartPrice: number; //price which we depend on as it could be changed from product price if it has new price
	id : string;
	name : string;
	description : string;
	image : string;
	price : number;
	ratings : Rating[];
	createdAt : number;
	favourite : boolean; //for design purposes
	amount : number; //for cart
	subcategoryId? : string;
	categoryId? : string;
	subcategory? : any;
	variables? : Variable[];
	orderedVariables? : any;
	discount : number;
	gallery : string[];
}