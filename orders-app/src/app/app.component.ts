import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { MARKET } from 'src/shared/config';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    private storage: Storage,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackOpaque();
      this.checkLang();
    });
  }

  checkLang() {
    this.storage.get('lang')
      .then(lang => {
        if (lang) {
          this.translateService.use(lang);
          this.showFirstPage();
          this.splashScreen.hide();
        } else {
          this.translateService.use(MARKET.defaultLang);
          this.showFirstPage();
          this.splashScreen.hide();
        }
      });

  }


  showFirstPage() { 
    this.storage.get('access_token')
      .then(market => {
        if (market) {
          this.navCtrl.navigateRoot('/tabs');
        } else {
          this.navCtrl.navigateRoot('/login');
        }
      });
  }


}
