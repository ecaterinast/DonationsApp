import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product} from '../../shared/product';
import { FavouritesProvider } from '../../providers/favourites/favourites';
import { DataProvider } from '../../providers/data/data';
import { Rating } from '../../shared/rating';
import { TranslationProvider } from '../../providers/translation/translation';
import { LangChangeEvent } from '@ngx-translate/core';



@IonicPage()
@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html',
})
export class FavouritesPage {

  products : Product[];
  direction: string;

  constructor(public navCtrl: NavController, public navParams: NavParams , 
    private favouriteService : FavouritesProvider , public dataService : DataProvider ,
    private translationService : TranslationProvider) {
    
   
  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.getFavourites();
    this.watchLang();
  }

  //favourites
  getFavourites() {
  	this.favouriteService.getFavourites()
  		.then(prods => {
  			if (prods) {
  				this.products = prods
  			}else {
  				this.products = [];
  			}
  		})
  }

  

  //remove from favourites
  removeFavourite(product : Product , index : number) {
    this.products.splice(index , 1);
    this.favouriteService.getFavourites()
      .then((products : Product[]) => {
        if (products) {
          let i = products.indexOf(product);
          products.splice(i , 1);
         
         this.favouriteService.addFavourites(products)  
        }
      });
  }

  //rating
  calcRating(ratings : Rating[]) {
    if (ratings.length == 0) return 0;
    let total = 0;
    ratings.forEach(rating => {
      total += rating.rating;
    })
    return (total/ratings.length);
  }

  //product details
  detail(product : Product) {
  	this.navCtrl.push('ProductDetailPage' , {
  		product : product
  	})
  }

  //watch lang change
  watchLang() {
    this.translationService.translateService.onLangChange
    .subscribe((ev : LangChangeEvent) => {
      this.direction = this.translationService.getDirection();
    })
  }

}
