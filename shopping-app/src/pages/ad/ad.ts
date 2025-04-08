import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Ad } from '../../shared/ad';


@IonicPage()
@Component({
  selector: 'page-ad',
  templateUrl: 'ad.html',
})
export class AdPage {

  ad: Ad;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public dataService: DataProvider,
    private events : Events
    ) {

    this.ad = this.navParams.get('ad');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdPage');
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  details() {
    this.viewCtrl.dismiss()
      .then(_ => this.events.publish('show-ad' , this.ad));
  }

}
