import { Order } from './order';
import { Address } from './address'

export interface Customer{
	id? : string;
	phone : any;
	name : string;
	image : string;
	owner : string;
	address? : Address[];
	orders? : Order[];
}