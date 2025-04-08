import { Injectable } from '@angular/core';
import { LoadingController , ToastController , ModalController } from 'ionic-angular'
import { TranslateService } from '@ngx-translate/core';
import { TranslationProvider } from '../translation/translation';



@Injectable()
export class FunctionsProvider {
	loading : any;
  showAd = true;


  constructor(private loadingCtrl : LoadingController , private toastCtrl : ToastController  
   , private modalCtrl : ModalController , private translatService : TranslationProvider) {
    //console.log('Hello FunctionsProvider Provider');
  }

  presentLoading() {
  	this.loading = this.loadingCtrl.create({
  		content : this.translatService.translate('MESSAGES.loading')
  	});

  	this.loading.present();
  }

  dismissLoading() {
  	this.loading.dismiss()
  }

  presentToast(msg : string , position?) {
  	let toast = this.toastCtrl.create({
  		message : msg , 
      duration : 3000,
      position: position? position : 'bottom',
      showCloseButton : true,
      closeButtonText : "X"
  	});

  	toast.present();
  }

  openCart() {
    let modal = this.modalCtrl.create('CartPage');
    modal.present();
  }

 

}
