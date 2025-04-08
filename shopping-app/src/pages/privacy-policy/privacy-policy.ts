import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';



@IonicPage()
@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {

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
