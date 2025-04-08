import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Platform, AlertController, Events } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { FunctionsProvider } from '../../providers/functions/functions';
import { Product } from '../../shared/product';
import { TranslationProvider } from '../../providers/translation/translation';
import { DataProvider } from '../../providers/data/data';
import { OrderProduct } from '../../shared/order';



@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage{

	products : OrderProduct[];
  total : number;
  unsubscribeBackEvent : any;
  direction: string;
  loading : boolean;
  refresher : boolean
  
  constructor(public navCtrl: NavController, public navParams: NavParams , 
    private cartService : CartProvider  ,	private viewCtrl : ViewController ,
     private functionsService : FunctionsProvider , private modalCtrl : ModalController , 
     private storage : Storage ,  private translationService : TranslationProvider , 
     private platform : Platform , public dataService : DataProvider , 
     private alertCtrl : AlertController , private events : Events) {
  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.watchBack();
    this.getCart();  
    }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  }

  //cart products
  getCart(refresherEvent? : any) {
    if(!refresherEvent) this.loading = true;
  	this.cartService.getProducts()
  		.then((products : OrderProduct[]) => {
  			if (products) {
          this.dataService.getCartProducts(products)
            .then((detailedProducts : OrderProduct[]) => {
              //update product price if it has a variable with additional price
              detailedProducts.forEach(product => {
                product.details.cartPrice = product.details.price;
                if (product.orderedVariables) {
                  let values = Object.keys(product.orderedVariables).map(function (key) {
                    return product.orderedVariables[key];
                  });
                  values.forEach(value => {
                    if (value.price) {
                      product.details.cartPrice += value.price;
                    }
                  });
                }
              })
              refresherEvent? refresherEvent.complete() : this.loading = false;
              this.products = detailedProducts;
              this.totalPrice();

            })
            .catch(err => {
              refresherEvent? refresherEvent.complete() : this.loading = false;              
              let msg = this.translationService.translate('MESSAGES.error');
              this.functionsService.presentToast(msg);
            })
  			} else {
          refresherEvent? refresherEvent.complete() : this.loading = false;              
          this.products = [];
        }
  		})
  }

  //total price
  totalPrice() {
  	let total = 0
  	this.products.forEach(product => {
  		total += (product.details.price * product.amount);
  	});
  	this.total = total;
  }

  //increase amount
  increase(product : OrderProduct , index : number) {
  	this.total += product.details.cartPrice;
  	this.products[index].amount += 1;
  	this.cartService.addProducts(this.products);

  }

  //decrease amount
  decrease(product : OrderProduct , index : number) {
    if (this.products[index].amount == 1) return;
  	this.total -= product.details.cartPrice;
  	this.products[index].amount -= 1;
  	this.cartService.addProducts(this.products);
  }

  //checkout
  checkout() {
    if (this.products.length == 0) return;
    this.storage.get('user')
      .then((user) => {
        if (user) {
          this.dismiss();
          let modal =this.modalCtrl.create('CashPage' , {
            products : this.products ,
            beforeDiscount : this.total
          });
          modal.present();

        } else {
          this.dismiss(true);
          let msg = this.translationService.translate('MESSAGES.login');
          this.functionsService.presentToast(msg);
          
        }
      })
   
  }

  //dismiss model
  dismiss(showLogin ? : boolean) {
    this.viewCtrl.dismiss()
      .then(dismissed => {
        if (showLogin) this.events.publish('show-login');;
      })
  }

  //remove product 
  removeProduct(index : number) {
    let deleteAlert = this.translationService.translate('MESSAGES.deleteAlert');
    let alert = this.alertCtrl.create({
      title : deleteAlert.title,
      message : deleteAlert.message,
      mode : 'ios',
      buttons : [
        {
          text : deleteAlert.cancel,
          role : 'cancel'
        },
        {
          text : deleteAlert.ok,
          handler : () => {
            this.products.splice(index , 1);
            this.totalPrice();
            this.cartService.addProducts(this.products);
          }
        }
      ]
    });
    
    alert.present();
  }

  //watch Back BTN
  watchBack() {
    this.unsubscribeBackEvent = this.platform.registerBackButtonAction(() => {
      this.dismiss();
    } , 1)
  }

  //show product info
  info(product : Product) {
    let modal = this.modalCtrl.create('ProductVariablesPage' , {product : product});
    modal.present();
  }

  //refresher
  doRefresh(ev){
    this.refresher = true;
    this.getCart(ev);
  }

  //track fun
  trackFn(product) {
    return product.id;
  }
  
}
