import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Address } from '../../shared/address';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';
import { TranslationProvider } from '../../providers/translation/translation';
import { Storage } from '@ionic/storage';
import { User } from '../../shared/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the AddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

  direction : string;
  isEditing : boolean;
  address : Address;
  index : number;
  customer : User;
  unsubscribeBackEvent : any;
  form : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams , 
    private dataService : DataProvider , private functionsService : FunctionsProvider ,
    private translationService : TranslationProvider , private storage : Storage , 
    private viewCtrl : ViewController , private platform  : Platform , 
    private fb : FormBuilder) {
      
      this.createForm();
  }

  ionViewWillEnter() {
   this.initializePage();
   this.watchBack();
  }

  
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  }
  


  //initialize page
  initializePage() {
    this.direction = this.translationService.getDirection();
    this.address = this.navParams.get('address');
    this.isEditing = this.address ? true : false;
    this.index = this.navParams.get('index');
    this.customer = this.navParams.get('customer');
    if (this.isEditing) {
      this.patchValue();
    }
    
  } 

  //form
  createForm() {
    this.form = this.fb.group({
      pincode : ['' , Validators.required],
      details : ['' , Validators.required],
      state : ['' , Validators.required],
      city :  ['' , Validators.required],
      country : ['' , Validators.required],
      default : [false , Validators.required]
    });
    

  }

  patchValue() {
    this.form.patchValue({
      'pincode' : this.address.pincode,
      'details' : this.address.details,
      'state' : this.address.state,
      'city' : this.address.city,
      'country' : this.address.country,
      'default' : this.address.default,
    });

  }

   //save address
   saveAddress() {
    let address = this.form.value;
    if (this.isEditing) {
      this.customer.address[this.index] = address;
    } else {
      this.customer.address.push(address);
    }
    this.editCustomer(address);

  }

  //edit customer
  editCustomer(address) {
    this.functionsService.presentLoading();
    this.dataService.editCustomer(this.customer)
      .subscribe((customer : User) => {
        this.customer = customer;
        this.storage.set('user' , customer)
          .then(() => {
            this.functionsService.dismissLoading();
            this.dismiss(address);
          })
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      });
  }

  dismiss(address?: Address) {
    this.viewCtrl.dismiss({address});
  }


  //watch Back BTN
  watchBack() {
    this.unsubscribeBackEvent = this.platform.registerBackButtonAction(() => {
      this.dismiss();
    } , 1)
  }
}
