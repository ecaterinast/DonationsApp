export interface Variable {
	id? : string;
	key : string,
	values : {
		name : string;
		stock? : number
	}[]
}
