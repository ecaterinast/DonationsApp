import { TranslationProvider } from './../../providers/translation/translation';
import { MARKET } from './../../shared/config';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { LangChangeEvent } from '@ngx-translate/core';
import { Contact } from '../../shared/contact';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  market;
  smsURL;
  telegramURL;
  direction : string;
  contact : Contact;
  loading: boolean;
  refresher : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams , private snaitizer : DomSanitizer , 
    private translationService : TranslationProvider , private dataService : DataProvider  ,
    private functionsService : FunctionsProvider , private sanitiser : DomSanitizer) {
    this.market = MARKET;
    this.watchLang();
  }

  ionViewWillEnter(){
    this.direction = this.translationService.getDirection();
    this.getContact()
  }
  
  //About Info
  getContact(refresherEvent? : any) {
    if(!refresherEvent)this.loading = true;
    this.dataService.getAboutInfo()
      .subscribe((contacts : Contact[]) => {
        if (refresherEvent) refresherEvent.complete();
        this.loading = false;
        this.contact = contacts[0];
        if (this.contact) {
          this.smsURL = this.snaitizer.bypassSecurityTrustUrl('sms:'+ this.contact.sms);
          this.telegramURL = this.sanitiser.bypassSecurityTrustUrl('tg://resolve?domain=' + this.contact.telegram)
        }
      } , err => {
        if (refresherEvent) refresherEvent.complete();
        this.loading = false;
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })
  }


  //watch lang change
  watchLang() {
    this.translationService.translateService.onLangChange
    .subscribe((ev : LangChangeEvent) => {
      this.direction = this.translationService.getDirection();
    })
  }

  //refresher
  doRefresh(event) {
    this.refresher = true;
    this.getContact(event);
  }

}
