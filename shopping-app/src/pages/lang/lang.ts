import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';
import { FCM } from '@ionic-native/fcm';
import { MARKET } from '../../shared/config';



@IonicPage()
@Component({
  selector: 'page-lang',
  templateUrl: 'lang.html',
})
export class LangPage {

  languages  = MARKET.languages;

  constructor(public navCtrl: NavController, public navParams: NavParams , 
    private translationService : TranslationProvider , private storage : Storage , 
    private viewCtrl : ViewController, private fcm : FCM ) {
  }

  choose(lang : string) {
    this.translationService.changeLang(lang);
    this.viewCtrl.dismiss(lang);
    this.storage.set('lang' , lang);
    this.checkFCM(lang);
  }

  checkFCM(lang : string) {

    if (lang == 'en') {
      this.fcm.unsubscribeFromTopic('ar');
      this.fcm.subscribeToTopic('en');
    } else {
      this.fcm.unsubscribeFromTopic('en');
      this.fcm.subscribeToTopic('ar');
    }  

    
  }

}
