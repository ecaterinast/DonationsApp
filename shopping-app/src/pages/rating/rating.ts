import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavParams} from 'ionic-angular';
import { FunctionsProvider } from '../../providers/functions/functions';
import { Rating } from '../../shared/rating';
import { TranslationProvider } from '../../providers/translation/translation';


@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {

 meanRating : number;
 loading : boolean = true;
 ratings : Rating[];
 direction : string;

 constructor(private functionsService: FunctionsProvider , public dataService : DataProvider,
   private navParams : NavParams , private translationService : TranslationProvider) { }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    let id = this.navParams.get('id');
    this.getRating(id);
  }

  //get rating
  getRating(productId) {
    this.loading = true;
    this.dataService.getRating(productId)
      .subscribe((ratings : Rating[]) => {
        this.loading = false;
        this.ratings = ratings;
        this.calcRating(this.ratings);
      } , err => {
        this.loading = false;
        let msg = this.translationService.translate('MESSAGES.error');
	      this.functionsService.presentToast(msg);
      })
  }



  //calc rating
  calcRating(ratings : Rating[]) {
    if (ratings.length == 0) return this.meanRating = 0;
    let total = 0;
    ratings.forEach(rating => {
      total += rating.rating;
    })
    this.meanRating = (total/ratings.length);
  }


}
