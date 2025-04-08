export interface Category{
	sliderId?: string;
	bannerId?: string;
	homeCategoriesId?: string;
	id? : string;
	name : string;
	image : string;
	subcategories? : [{
		id : string;
		categoryId : number;
		name : string;
	}];
	
}