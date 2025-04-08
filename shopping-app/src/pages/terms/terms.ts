import { Component } from '@angular/core';
import { IonicPage, ViewController , NavParams } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';



@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  lang : string;
  isModal : boolean;
  direction: string;

  constructor(
    private translationService : TranslationProvider ,
     private viewCtrl : ViewController ,
     private navParams : NavParams
      ) {
  }

  ionViewWillEnter() {
    this.isModal = this.navParams.get('isModal');
    this.lang = this.translationService.getLang();
    this.direction = this.translationService.getDirection();
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

}
