import { Order } from './order';
import { Address } from './address'

export interface User{
	id? : string;
	owner? : string;
	image : string;
	phone : any;
	name : string;
	facebookUserId? : string;
	address? : Address[];
	orders? : Order[];
	appleUserId? : string;
}