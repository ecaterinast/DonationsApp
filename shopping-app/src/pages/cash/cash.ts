import { TranslationProvider } from './../../providers/translation/translation';
import { CartProvider } from './../../providers/cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, Platform, ModalController } from 'ionic-angular';
import { Order, OrderProduct } from '../../shared/order';
import { Product } from '../../shared/product';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';
import { Storage } from '@ionic/storage';
import { User } from '../../shared/user';
import { Copoun } from '../../shared/copoun';
import { Zone } from '../../shared/zone';
import { OrderStatus } from '../../shared/orderStatus';



@IonicPage()
@Component({
  selector: 'page-cash',
  templateUrl: 'cash.html',
})
export class CashPage {
  products: OrderProduct[];
  customer: User;
  address: string;
  unsubscribeBackEvent: any;
  code: string = '';
  copoun: Copoun;
  zones: Zone[];
  zone: any;
  direction: string;
  selectOptions = {
    mode: 'ios',
  };
  beforeDiscount: number;
  discount: number;
  afterDiscount: number;
  deliveryCost: number;
  total: number;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dataService: DataProvider, private functionsService: FunctionsProvider,
    private storage: Storage, private sheetCtrl: ActionSheetController,
    private viewCtrl: ViewController, private cartService: CartProvider,
    private translationService: TranslationProvider, private platform: Platform,
    private modalCtrl: ModalController) {
    this.products = this.navParams.get('products');
    this.beforeDiscount = this.navParams.get('beforeDiscount');

  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.getShippingZones();
    this.getUser();
    this.watchBack();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  }

  getUser() {
    this.storage.get('user')
      .then(user => {
        if (user) {
          this.customer = user;
          let filter = this.customer.address.filter(address => {
            return address.default == true;
          })[0];
          if (filter) {
            this.address = `${filter.details} , ${filter.city} , ${filter.state} - ${filter.pincode} , ${filter.country}`;
          }
        }
      });
  }



  changeAddress() {
    let title = this.translationService.translate('ORDER.choose');
    let cancel = this.translationService.translate('PROFILE.cancel');
    let newAddress = this.translationService.translate('PROFILE.newAddress');
    let sheet = this.sheetCtrl.create({
      title: title
    });

    this.customer.address.forEach(address => {
      sheet.addButton({
        text: address.details,
        icon: 'pin',
        handler: () => {
          this.address = `${address.details} , ${address.city} , ${address.state} - ${address.pincode} , ${address.country}`
        }
      });
    });

    sheet.addButton({ text: newAddress, icon: 'add', handler: () => this.newAddress() });
    sheet.addButton({ text: cancel, icon: 'close', role: 'cancel' });

    sheet.present();

  }




  //newAddress
  newAddress() {
    let modal = this.modalCtrl.create('AddressPage', {
      customer: this.customer
    });

    modal.present();

    modal.onDidDismiss(data => {
      let address = data.address;
      if (address) {
        this.address = `${address.details} , ${address.city} , ${address.state} - ${address.pincode} , ${address.country}`
      }
    })
  }


  //make an order
  order() {
    this.functionsService.presentLoading();
    let date: Date = new Date();

    //delete product details data
    this.products.forEach(product => {
      delete product.details;
    });

    let order: Order = {
      phone: this.customer.phone,
      address: this.address,
      name: this.customer.name,
      products: this.products,
      total: this.total,
      type: 'cash',
      status: OrderStatus.waiting,
      customerId: this.customer.id,
      copounId: this.copoun ? this.copoun.id : '',
      shippingZone: this.zone == 'other' ? this.zone : this.zone.id,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }


    this.dataService.cashOrder(order)
      .subscribe((res) => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.order');
        this.functionsService.presentToast(msg);
        this.dismiss();
        this.cartService.clear();
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })

  }

  //dismiss model
  dismiss() {
    this.viewCtrl.dismiss();
  }

  //watch Back BTN
  watchBack() {
    this.unsubscribeBackEvent = this.platform.registerBackButtonAction(() => {
      this.dismiss();
    }, 1)
  }


  //copouns section
  verifyCopoun(stepper) {
    this.discount = 0;
    if (this.code.length == 0) {
      this.afterDiscount = this.beforeDiscount;
      this.showBill();
      return stepper.nextStep();
    }
    this.functionsService.presentLoading();
    this.dataService.getCopoun(this.code.toLowerCase())
      .subscribe((copouns: Copoun[]) => {
        this.functionsService.dismissLoading();
        if (copouns.length != 0) {
          let copoun = copouns[0];
          if (copoun.validUntil > new Date().getTime()) {
            this.discount = copoun.discount;
            this.afterDiscount = this.beforeDiscount - this.beforeDiscount * (this.discount / 100);
            this.copoun = copoun;
            this.showBill();
            stepper.nextStep();
          } else {
            let msg = this.translationService.translate('MESSAGES.outDatedCopoun');
            return this.functionsService.presentToast(msg);
          }
        } else {
          let msg = this.translationService.translate('MESSAGES.notValidCopoun');
          return this.functionsService.presentToast(msg);
        }
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })
  }

  //shipping zones
  getShippingZones() {
    this.dataService.getZonnes()
      .subscribe((zones: Zone[]) => {
        this.zones = zones;
      }, err => {
        this.dismiss();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })
  }

  //amount payable
  showBill() {
    if (this.zone != 'other') {
      this.deliveryCost = this.zone.cost;
      this.total = this.deliveryCost + this.afterDiscount;
    } else {
      this.total = this.afterDiscount;
    }
  }


}
