import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavParams , ViewController } from 'ionic-angular';
import { FormGroup , FormBuilder , Validators} from '@angular/forms';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';
import { Rating } from '../../shared/rating'
import { TranslationProvider } from '../../providers/translation/translation';


@IonicPage()
@Component({
  selector: 'page-add-rating',
  templateUrl: 'add-rating.html',
})
export class AddRatingPage {
   form : FormGroup;
   id : string;
   rating : number;
   direction : string;
	

  constructor(private fb : FormBuilder , private dataService : DataProvider ,
   private functionsService : FunctionsProvider , private viewCtrl : ViewController , 
   private navParms : NavParams , private storage : Storage , private translationService : TranslationProvider) { 
   
	this.id = this.navParms.get('id');
  	this.createForm();
  }

  ionViewWillEnter(){
	this.direction = this.translationService.getDirection();

  }


  
  createForm() {
  	this.form = this.fb.group({
  		comment : ['' , Validators.required]
  	});  	
  }

 
	onSubmit() {
		this.functionsService.presentLoading();
		this.storage.get('user')
			.then(user => {
				if (user) {
					let rating : Rating = {
						customerId : user.id,
						productId : this.id,
						rating : this.rating ,
						comment : this.form.value.comment
					}
			
					this.dataService.addRating(rating)
						.subscribe(res => {
							this.functionsService.dismissLoading();
							let msg = this.translationService.translate('MESSAGES.rating');
							this.functionsService.presentToast(msg);
							this.dismiss();
						} , err => {
							this.functionsService.dismissLoading();
							let msg = this.translationService.translate('MESSAGES.error');
							this.functionsService.presentToast(msg);
						});
				}
			})
	}

 dismiss() {
 	this.viewCtrl.dismiss();
 }

 onRate(ev) {
 	this.rating = ev.newValue;
 }

}
