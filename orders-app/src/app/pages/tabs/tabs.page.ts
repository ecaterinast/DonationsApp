import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Howl } from 'howler';
import { DataService } from 'src/app/providers/data/data.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private alertCtrl: AlertController, 
    private translateService: TranslateService,
    private fcm: FCM, 
    private iab: InAppBrowser, 
    private dataService: DataService ,
    private platform : Platform
    ) {

  }

  ngOnInit() {
    this.initializeFCM();
  }


  //fcm handling
  initializeFCM() {
    if(!this.platform.is('cordova')) return;
    this.fcm.requestPushPermission();
    this.fcm.subscribeToTopic(`orders`);
    this.fcm.onNotification()
      .subscribe(data => {
        if (!data.wasTapped) {
          this.showNewOrderAlert();
        }
      });

  }


  //order alert
  async showNewOrderAlert() {
    let orderAlert = this.translateService.instant('MESSAGES.orderAlert');
    let alert = await this.alertCtrl.create({
      mode: 'ios',
      header: orderAlert.header,
      message: orderAlert.message,
      buttons: [
        {
          role: 'cancel',
          text: orderAlert.ok
        }
      ]
    });

    this.playSound();
    await alert.present();
  }

  playSound() {
    var sound = new Howl({
      src: ['../../../assets/sound/inflicted.mp3']
    });
    sound.play();
  }

  //show control panel
  showControlPanel() {
    this.iab.create(this.dataService.controlPanel);
  }

}
