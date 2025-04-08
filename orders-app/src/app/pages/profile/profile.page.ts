import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { NavController } from '@ionic/angular';
import { FunctionsService } from 'src/app/providers/functions/functions.service';
import { MARKET } from 'src/shared/config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  lang : string;
  direction: string;
  market = MARKET;

  constructor(private storage : Storage , private translateSevice : TranslateService ,
     private navCtrl : NavController , private functionsService : FunctionsService , 
     private fcm : FCM) { }

  ngOnInit() {
    this.lang = this.translateSevice.currentLang;
    this.functionsService.getDirection()
      .subscribe(dir => this.direction = dir);
  }


  

  changeLang(ev) {    
    this.translateSevice.use(ev.detail.value);
    this.translateSevice.setDefaultLang(ev.detail.value);
    this.storage.set('lang' , ev.detail.value);
  }

  logout() {
    this.fcm.unsubscribeFromTopic(`orders`);
    this.storage.remove('access_token');
    this.navCtrl.navigateRoot('/login');
  }

}
