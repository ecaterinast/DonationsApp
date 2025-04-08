export interface Category{
	id : string;
	name : string;
	image : string;
	gradient? : string;
	subcategories : [{
		id : string;
		categoryId : number;
		name : string;
	}];
	
}