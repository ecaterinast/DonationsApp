import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { User } from './../../shared/user';
import { FunctionsProvider } from './../../providers/functions/functions';
import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js'
import { MARKET } from '../../shared/config';



@IonicPage()
@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
})
export class CreateProfilePage {

  imageURL: string;
  file: File;
  form: FormGroup;
  userId: string;
  phone: any;
  agreeToTerms = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dataService: DataProvider, private functionsService: FunctionsProvider,
    private storage: Storage, private translationService: TranslationProvider,
    private fb: FormBuilder, private events: Events , private modalCtrl : ModalController) {

    this.createForm();
  }




  onImageSelected(ev) {
    let file = ev.target.files[0];
    if (file) {
      this.file = file;
      let reader = new FileReader();
      reader.onloadend = (ev: any) => {
        this.imageURL = ev.target.result
      }
      reader.readAsDataURL(file);
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    })
  }

  onSubmit() {
    if(!this.form || !this.form.valid || !this.agreeToTerms) return;
    let form = this.form.value;
    if (form.password !== form.repassword) {
      let msg = this.translationService.translate('MESSAGES.notMatched')
      return this.functionsService.presentToast(msg)
    }
    //validate phone number according to market country codes
    let isValidPhone = false;
    MARKET.countryCodes.forEach((code : CountryCode) => {
      let phone = parsePhoneNumberFromString(form.phone, code);
     // if (phone.isValid()) {
        isValidPhone = true;
        this.phone = phone;
     // }
    });
    if (!isValidPhone) {
      let msg = this.translationService.translate('MESSAGES.phoneErr')
      return this.functionsService.presentToast(msg)
    }

    
    this.functionsService.presentLoading();

    this.dataService.newUser({ email: form.email, password: form.password, phone: this.phone.number, name: form.name })
      .subscribe((user: any) => {
        this.userId = user.id;
        if (this.file)
          this.saveImage();
        else
          this.saveCustomer("")
      }, err => {
        this.functionsService.dismissLoading();
        if (err.status == 422) {
          let msg = this.translationService.translate('MESSAGES.emailUsed')
          this.functionsService.presentToast(msg)
        } else {
          let msg = this.translationService.translate('MESSAGES.error');
          this.functionsService.presentToast(msg);
        }
      })



  }


  saveImage() {
    this.dataService.upload(this.file)
      .subscribe((upload: any) => {
        this.saveCustomer(upload.result.files.file[0].name)
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })

  }


  saveCustomer(imageURL) {
    let customer: User = {
      owner: this.userId,
      name: this.form.value.name,
      phone: this.phone.number,
      image: imageURL
    }
    this.dataService.newCustomer(customer)
      .subscribe(res => {
        this.storage.set('user', res).then(() => {
          this.functionsService.dismissLoading();
          this.events.publish('user');
          this.navCtrl.setRoot('HomePage');
        })
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })
  }


  showTerms() {
    let modal = this.modalCtrl.create('TermsPage' , {
      isModal : true
    });
    modal.present();
  }

  showPrivacy() {
    let modal = this.modalCtrl.create('PrivacyPolicyPage' , {
      isModal : true
    });
    modal.present();
  }

}
