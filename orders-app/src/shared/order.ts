import { Product } from './product'
import { Copoun } from './copoun';

export interface OrderProduct{
	id : string;
	amount : number;
	details : Product;
	orderedVariables : any;
}

export interface Order{
	id? : string;
	name : string;
	phone : string;
	products : OrderProduct[];
	total : number;
	address : any;
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
	code : number;
	paymentMethode : string;
	buyFrom : string;
}