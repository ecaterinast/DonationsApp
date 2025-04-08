import { Address } from './address';
import { Copoun } from './copoun';
import { Product } from './product';

export interface OrderProduct{
	id : string;
	amount : number;
	orderedVariables : any;
	details? : Product;
}

export interface Order{
	id? : string;
	name : string;
	phone : string;
	products : OrderProduct[];
	total : number;
	address : string;
	type : string;
	createdAt? : string;
	status : string;
	customerId : string;
	copounId? : string;
	copoun? : Copoun;
	shippingZone? : string;
	day : number;
	month : number;
	year : number;
}