import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { MARKET } from 'src/shared/config';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  isLoading = false;
  direction = new BehaviorSubject('rtl');

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private translateService: TranslateService ) {
    this.watchDirection();
  }


  getDirection() {
    return this.direction.asObservable();
  }

  presentLoading() {
    this.isLoading = true;
    this.loadingCtrl.create({
      message: this.translateService.instant('MESSAGES.loading'),
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }



  async presentToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'text-center'
    });
    await toast.present();
  }

  watchDirection() {
    this.translateService.onLangChange.subscribe((ev: LangChangeEvent) => {
      let lang = ev.lang;
      let dir = MARKET.languages.filter(language => language.code == lang)[0].direction;
      this.direction.next(dir);
    })
  }


}
