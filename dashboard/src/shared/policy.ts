export enum PolicyType{
    orders = 'orders',
    market = 'market'
}

export interface Policy{
    id?: string;
    type : string;
    body : string;
}