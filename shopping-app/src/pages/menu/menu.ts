import { MARKET } from './../../shared/config';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, PopoverController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslationProvider } from '../../providers/translation/translation';
import { DataProvider } from '../../providers/data/data';
import { FCM } from '@ionic-native/fcm';





@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';
  user: any;
  market = MARKET;
  lang: string;
  side: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataProvider,
    private storage: Storage, private socialSharing: SocialSharing,
    private translationService: TranslationProvider, private popCtrl: PopoverController,
    private events: Events, private fcm: FCM) {

    //get lang
    setTimeout(() => {
      this.getLang();
    }, 500)

    //refresh user data when login or signup
    this.watchUser();
    //show login page if user not signed in and want to order;
    this.showLogin();
    // show ads detals
    this.showAdDetail();
  }

  ionViewWillEnter() {
    this.getUser();
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }


  //language
  getLang() {
    if (!this.lang) {
      this.lang = this.translationService.getLang();
    }
  }

  //get user
  getUser() {
    this.storage.get('user')
      .then(user => {
        if (user) {
          this.user = user
        }
      });
  }



  //log out;
  logout() {
    this.storage.remove('user');
    this.fcm.unsubscribeFromTopic('customers-' + this.user.id);
    this.user = undefined;
  }



  //share app
  share() {

    let message = `${this.market.name} 
     ${this.market.description} 
      get it on Google Play :
      ${this.market.googlePlayLink} 
      get it on Appstore :
      ${this.market.appStoreURL}  `;

    this.socialSharing.share(message)
      .then(() => console.log('success'))
      .catch((err) => alert(JSON.stringify(err)));
  }


  //change lang
  chooseLang(ev) {
    let pop = this.popCtrl.create('LangPage');
    pop.present({ ev: ev });
    pop.onDidDismiss(data => {
      if (data) {
        this.lang = data;
      }
    })
  }

  watchUser() {
    this.events.subscribe('user', () => {
      this.getUser();
    })
  }

  //show login if needed
  showLogin() {
    this.events.subscribe('show-login', res => {
      this.nav.push('LoginPage');
    })
  }

  //show ads details
  showAdDetail() {
    this.events.subscribe('show-ad', res => {
      if (res.product && res.product != null) {
        this.nav.push('ProductDetailPage', {
          product: res.product
        })
      }
      else if (res.categoryId) {
        this.nav.push('CategoryDetailPage', {
          catId: res.categoryId
        });
      }
      else if (res.brandId) {
        this.nav.push('BrandDetailPage', {
          brandId: res.brandId
        });
      }
    })
  }

}