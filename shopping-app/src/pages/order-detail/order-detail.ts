import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';
import { TranslationProvider } from '../../providers/translation/translation';
import { Order, OrderProduct } from '../../shared/order';
import { OrderStatus } from '../../shared/orderStatus';

/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  order: Order;
  loading : boolean;
  direction : string;
  status = OrderStatus;
  refresher : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams , 
    public dataService : DataProvider , private functionsService : FunctionsProvider ,
    private translateService : TranslationProvider , private modalCtrl : ModalController) {
  }

  ionViewWillEnter() {
    this.direction = this.translateService.getDirection();
    this.getOrder();
  }

  //order details
  getOrder(refresherEvent? : any) {
    if (!refresherEvent) this.loading = true;
   
    let order = this.navParams.get('order');
    this.dataService.getOrderProducts(order.products)
      .then((products : OrderProduct[]) => {
        refresherEvent? refresherEvent.complete() : this.loading = false;
        order.products = products;
        this.order = order;
      })
      .catch(err => {
        refresherEvent? refresherEvent.complete() : this.loading = false;
        let msg = this.translateService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })
  }

  onRefresh(ev) {
    this.refresher = true;
    this.getOrder(ev);
  }

  //cancel order
  cancelOrder() {
    this.functionsService.presentLoading();
    this.dataService.cancelOrder(this.order)
      .subscribe(res => {
        this.functionsService.dismissLoading();
        this.order.status = OrderStatus.cancelled; 
        let msg = this.translateService.translate('MESSAGES.orderCancelled');
        this.functionsService.presentToast(msg);
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translateService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      });
  }

   //rate page
   rate(product) {
    let modal =  this.modalCtrl.create('AddRatingPage' , {
        id : product.id 
    });
    modal.present();
  }

  //product detail
  detail(product) {
    this.navCtrl.push('ProductDetailPage' , {
      product : product
    })
  }


}
