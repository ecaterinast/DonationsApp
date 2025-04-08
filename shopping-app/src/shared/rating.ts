import { User } from './user';
export interface Rating{
	customerId : string;
	productId : string;
	rating : number;
	comment : string;
	createdAt? : number;
	customer? : User
}