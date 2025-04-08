import { TranslationProvider } from './../providers/translation/translation';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { Platform, App, Events  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FunctionsProvider } from '../providers/functions/functions';
import {FCM  } from '@ionic-native/fcm'
import { MARKET } from '../shared/config';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string =  'MenuPage';

  
  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen , 
    private storage : Storage , private app : App ,private translationService : TranslationProvider , 
    private fcm : FCM , private functionsService : FunctionsProvider , 
    private events : Events) {
    this.platform.ready().then(() => {
      //lang check
      this.checkLang();
      //status bar color
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#222222');
      //hide splash
      splashScreen.hide();
      //watch back button
      this.watchBack();
      //initialize fcm
      this.initializeFCM();
    });
  }


  //back button handling
  watchBack() {
    this.platform.registerBackButtonAction(() => {
      let nav = this.app.getActiveNavs()[0];
      let active = nav.getActive();
      if (active.id == 'HomePage' || active.id == 'WelcomePage') {
        this.platform.exitApp();
      }
      else {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          nav.setRoot('HomePage');
        }
      }
    } , 0)
  }


  //check lang
  checkLang() {
    this.storage.get('lang')
      .then(lang => {
        if (lang) {
          this.translationService.changeLang(lang);
          this.fcm.subscribeToTopic(lang);
        } else {
          this.translationService.changeLang(MARKET.defaultLang);
          this.storage.set('lang' ,MARKET.defaultLang);

        }
      })
  }

  //fcm 
  initializeFCM() {
    this.customerTopic();
    this.fcm.subscribeToTopic('mtgrk-all');
    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        //Received in background
      } else {
        //Received in foreground
        let body = this.platform.is('ios') ? data.aps.alert.body : data.body;
        this.functionsService.presentToast(body ,'top');
      };
    });    
  }

  customerTopic() {
    this.storage.get('user')
      .then(user => {
        if (user) {
            this.fcm.subscribeToTopic('customers-' + user.id );
        }
      });
  }

  watchUser() {
    this.events.subscribe('user' , () => {
      this.customerTopic();
    })
  }


  
}

