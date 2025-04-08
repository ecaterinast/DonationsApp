import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Platform } from 'ionic-angular';
import { OrderProduct } from '../../shared/order';
const PRODUCT_KEY = 'products';

@Injectable()
export class CartProvider {
	products : number;
	$products : BehaviorSubject<number> = new BehaviorSubject(null);


  constructor(private storage : Storage , private plt : Platform) {
    this.plt.ready()
	  .then(() => {
	  	this.getProducts()
	  		.then(products => {
	  			if (products) {
	  				this.products = products.length;
           			this.$products.next(this.products);
	  			} else {
	  				this.products = 0;
	  			}
	  		})
	  });

  }

  addProducts(products : OrderProduct[]) {
  	this.products = products.length;
  	this.$products.next(this.products);
  	return this.storage.set(PRODUCT_KEY , products);
  }

  getProducts() {
  	return this.storage.get(PRODUCT_KEY);
  }

  watchCart() {
  	return this.$products.asObservable();
  }

  clear(){
	  this.products = 0;
	  this.$products.next(this.products);
	  return this.storage.remove(PRODUCT_KEY);
  }

 

}
