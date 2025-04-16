import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Component , OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , ModalController , AlertController ,
         Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User } from '../../shared/user';
import { FunctionsProvider } from '../../providers/functions/functions';
import { DataProvider } from '../../providers/data/data';
import { FavouritesProvider } from '../../providers/favourites/favourites';
import { CartProvider } from '../../providers/cart/cart';
import { Address } from '../../shared/address';
import { Order } from '../../shared/order';
import { TranslationProvider } from '../../providers/translation/translation';
import { LangChangeEvent } from '@ngx-translate/core';
import { OrderStatus } from '../../shared/orderStatus';
import { Subscription } from 'rxjs';




@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnDestroy {
  @ViewChild('content') content : Content;
	customer : User;
  phone : string;
  favouritesNo : number;
  cartNo : number;
  segment : string = "address";
  orders : Order[];
  loading : boolean = false;
  direction : string;
  lang: string;
  status = OrderStatus;
  favoritesSubscription : Subscription;
  cartSubscription : Subscription;


  constructor(public navCtrl: NavController, public navParams: NavParams ,
  	private storage : Storage , public dataService : DataProvider , 
    private functionsService : FunctionsProvider, private favouriteService : FavouritesProvider ,
    private cartService : CartProvider , private modalCtrl : ModalController ,
    private alertCtrl : AlertController , private translationService : TranslationProvider) {

    this.favouritesNo = this.favouriteService.favourites;
    this.cartNo = this.cartService.products;

  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.lang = this.translationService.getLang();
    this.getProfile();
    this.watchFavourites();
    this.watchCart();
    this.watchLang();
  }

  ngOnDestroy() {
    this.favoritesSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  //profile data
  getProfile() {
    this.storage.get('user')
      .then(user => {
        if (user) {
          this.customer = user;
          this.phone = user.phone;
        } 
      });
  }



  //edit Name
  edit() {
    let title = this.translationService.translate('PROFILE.editTitle');
    let name = this.translationService.translate('FORM.name');
    let phone = this.translationService.translate('FORM.phone');
    let cancel = this.translationService.translate('PROFILE.cancel');
    let save = this.translationService.translate('PROFILE.save');

    let alert = this.alertCtrl.create({
      mode: 'ios',
      title : title,
      inputs : [
        {
          type : 'text',
          name : 'name',
          placeholder : name,
          value : this.customer.name
        },
        {
          type : 'text',
          name : 'phone',
          placeholder : phone,
          value : this.customer.phone
        }
      ],
      buttons : [
        {
          text : cancel,
          role : 'cancel'
        }
        ,
        {
          text : save ,
          handler : () => {
            alert.onDidDismiss(data => {
              if (data && data.name.length != 0 && data.phone.length != 0) {
                this.customer.name = data.name;
                let phone = parsePhoneNumberFromString(data.phone, 'EG')
                if (phone) {
                  // if (!phone.isValid()) {
                  //     let msg = this.translationService.translate('MESSAGES.phoneErr')
                  //     return this.functionsService.presentToast(msg)
                  // } 
                  this.customer.phone = phone.number;
                  this.editCustomer();

                }
                
              }
            })
          }
        }
      ]
    });

    alert.present();
  }

  //favourites page
  favourites() {
    this.navCtrl.push('FavouritesPage');
  }

  //cart Page
  cart() {
    this.functionsService.openCart();
  }

   //watch favourites
   watchFavourites() {
    this.favoritesSubscription = this.favouriteService.watchFavourites()
      .subscribe(favouritesNo => {
        this.favouritesNo = favouritesNo;
      })
  }

  //watch Cart
  watchCart() {
    this.cartSubscription = this.cartService.watchCart()
      .subscribe(cartNo => {
        this.cartNo = cartNo;
      })
  }

  //new Address
  newAddress() {
    let modal = this.modalCtrl.create('AddressPage' , {
      customer : this.customer
    });

    modal.present();

    modal.onDidDismiss(data => {
      if (data.address) {
        this.getProfile();
      }
    })
  }

  //delete address
  deleteAddress(index) {
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
            this.customer.address.splice(index , 1);
            this.editCustomer();
          }
        }
      ]
    });

    alert.present();
  }

  //edit address
  editAddress(address : Address , index : number) {
    let modal = this.modalCtrl.create('AddressPage' , {
      customer : this.customer,
      address , index
    });

    modal.present();

    modal.onDidDismiss(data => {
      if (data.address) {
          this.getProfile();
      }
    }) 
  }

  //edit customer
  editCustomer() {
    this.functionsService.presentLoading();
    this.dataService.editCustomer(this.customer)
      .subscribe((customer : User) => {
        this.functionsService.dismissLoading();
        this.customer = customer;
        this.storage.set('user' , customer);
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      });
  }

 
  //change image
  onImageSelected(ev) {
    let file = ev.target.files[0];
    if (file) {
      this.functionsService.presentLoading();
      this.dataService.upload(file)
        .subscribe((upload : any) => {
          this.customer.image = upload.result.files.file[0].name
          this.dataService.editCustomer(this.customer)
            .subscribe(res => {
              this.functionsService.dismissLoading();
              this.storage.set('user' , res);
            } , err => {
              this.functionsService.dismissLoading();
              let msg = this.translationService.translate('MESSAGES.error');
	            this.functionsService.presentToast(msg);
            })
        } , err => {
          this.functionsService.dismissLoading();
          let msg = this.translationService.translate('MESSAGES.error');
	        this.functionsService.presentToast(msg);
        });
    }
  }

  //segment
  segmentChanged(ev) {
      if (ev.value == 'orders') {
        this.getOrders();
      }
  }

  //get orders
  getOrders() {
    this.loading = true;
    this.dataService.getOrders(this.customer.id)
      .subscribe((orders : Order[]) => {
        this.loading = false;
        this.orders = orders;
      } , err => {
        this.loading = false;
        let msg = this.translationService.translate('MESSAGES.error');
	      this.functionsService.presentToast(msg);
      })
  }


  //watch lang change
  watchLang() {
    this.translationService.translateService.onLangChange
    .subscribe((ev : LangChangeEvent) => {
      this.lang = ev.lang;
      this.direction = this.translationService.getDirection();
    })
  }


  //order detail
  orderDetail(order) {
    this.navCtrl.push('OrderDetailPage' , {order})
  }
 

}
