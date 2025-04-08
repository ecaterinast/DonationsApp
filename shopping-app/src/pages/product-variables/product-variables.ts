import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslationProvider } from '../../providers/translation/translation';
import { CartProvider } from '../../providers/cart/cart';
import { OrderProduct } from '../../shared/order';

/**
 * Generated class for the ProductVariablesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-variables',
  templateUrl: 'product-variables.html',
})
export class ProductVariablesPage {

  form : FormGroup;
  product : OrderProduct;
  unsubscribeBackEvent : any;
  direction: string;
  selectOptions = {
    mode : 'ios'
  }


  constructor(public navCtrl: NavController, public navParams: NavParams , 
   private viewCtrl : ViewController, private platform : Platform ,
    private translationService : TranslationProvider , private cartService : CartProvider ) {

    this.createForm();


  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  }


   //form
   createForm() {
    this.product = this.navParams.get('product');
    console.log(this.product);
    
    let variables = this.product.details.variables;
    if (variables && variables.length != 0) {
      let formGroup : FormGroup = new FormGroup({});
      for(let variable of variables) {
        let key = variable.key;
        formGroup.addControl( key , new FormControl('' , Validators.required));
      }
      this.form =  formGroup;
    }

    this.patchValue()
    
  }

  patchValue() {
    let formValue = {};
    for(let variable of this.product.details.variables) {
      let key = variable.key;
      let value = this.product.orderedVariables[key];
        formValue[key] = value.name;
    } 
    setTimeout(() => {
      this.form.patchValue(formValue);
    }, 100)
    
  }

  onSubmit() {
    let form = this.form.value;
    console.log(this.form.value);
    for(let variable of this.product.details.variables) {
      let key = variable.key;
      let formValue = form[key];
      for(let value of variable.values) {
        if (value.name == formValue) {
          form[key] = value
        }
      }
    } 
    this.product.orderedVariables = form;
    this.addToCart();
  }

  //add to cart
  addToCart() {
    this.cartService.getProducts()
      .then((products : OrderProduct[]) => {
        if (products) {
            let newProducts =  products.map(product => {
              if (product.id == this.product.id) {
                let orderProduct : OrderProduct = {
                  id : this.product.id,
                  amount : this.product.amount,
                  orderedVariables : this.product.orderedVariables
                }
                return  product = orderProduct;                
              } 
            });
          
            this.cartService.addProducts(newProducts)
              .then(() => this.dismiss());
        } 
      })
  }


  //dismiss modal
  dismiss() {
    this.viewCtrl.dismiss();
  }

  //watch back
  watchBack() {
    this.unsubscribeBackEvent = this.platform.registerBackButtonAction(() => {
      this.dismiss();
    } , 1)
  }

}
