import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Product } from '../../shared/product';
import { BehaviorSubject } from 'rxjs';
import { Platform } from 'ionic-angular';
const FAVOURITE_KEY = 'favourites';


@Injectable()
export class FavouritesProvider {
	favourites : number;
	$favourites : BehaviorSubject<number> = new BehaviorSubject(null);

   constructor(private storage : Storage , private plt : Platform) {
    this.plt.ready()
	  .then(() => {
	  	this.getFavourites()
	  		.then(favourites => {
	  			if (favourites) {
	  				this.favourites = favourites.length;
            this.$favourites.next(this.favourites)
	  			} else {
	  				this.favourites = 0;
	  			}
	  		})
	  });

  }

  addFavourites(products : Product[]) {
  	this.favourites = products.length;
  	this.$favourites.next(this.favourites);
  	return this.storage.set(FAVOURITE_KEY , products);
  }

  getFavourites() {
  	return this.storage.get(FAVOURITE_KEY);
  }

  watchFavourites() {
  	return this.$favourites.asObservable();
  }

}
