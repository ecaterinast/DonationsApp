import { TranslationProvider } from './../../providers/translation/translation';
import { Storage } from '@ionic/storage';
import { DataProvider } from './../../providers/data/data';
import { FunctionsProvider } from './../../providers/functions/functions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { User } from '../../shared/user';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js'
import { LangChangeEvent } from '@ngx-translate/core';
import { MARKET } from '../../shared/config';

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  form: FormGroup;
  direction: string;
  customer: User;
  showAppleSignIn: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private fb: FormBuilder, private functionsService: FunctionsProvider,
    private dataService: DataProvider, private storage: Storage, private events: Events,
    private translationService: TranslationProvider, private alertCtrl: AlertController,
    private facebook: Facebook, private platform: Platform) {

    this.createForm();
  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.showAppleSignIn = !this.platform.is('android');
    this.watchLang();
  }

  createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.functionsService.presentLoading();
    let form = this.form.value;
    this.dataService.login(form)
      .subscribe((res: any) => {
        this.dataService.getCustomer(res.userId)
          .subscribe((customers: any[]) => {
            if (customers.length != 0) {
              this.storage.set('user', customers[0])
                .then(() => {
                  this.functionsService.dismissLoading();
                  this.events.publish('user');
                  this.navCtrl.setRoot('HomePage');
                })
            } else {
              this.functionsService.dismissLoading();
              let msg = this.translationService.translate('MESSAGES.error');
              this.functionsService.presentToast(msg);
            }
          })
      }, err => {
        this.functionsService.dismissLoading();
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })
  }

  signup() {
    this.navCtrl.push('CreateProfilePage')
  }


  resetPassword() {
    let resetAlert = this.translationService.translate('MESSAGES.resetAlert');
    let alert = this.alertCtrl.create({
      title: resetAlert.title,
      message: resetAlert.message,
      mode: 'ios',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: resetAlert.placeholder
        }
      ],
      buttons: [
        {
          text: resetAlert.cancel,
          role: 'cancel'
        },
        {
          text: resetAlert.ok,
          handler: () => {
            alert.onDidDismiss(data => {
              if (data && data.email && data.email.trim() != '') {
                this.functionsService.presentLoading();
                this.dataService.resetPassword(data.email)
                  .subscribe(res => {
                    this.functionsService.dismissLoading();
                    let msg = this.translationService.translate('MESSAGES.resetEmail')
                    this.functionsService.presentToast(msg);
                  }, err => {
                    this.functionsService.dismissLoading();
                    let msg = this.translationService.translate('MESSAGES.error')
                    this.functionsService.presentToast(msg);
                  })
              }
            })
          }
        }
      ]
    });


    alert.present();

  }

  appleLogin() {

    if (this.customer) {
      //this means that he has logged in , but not enter phone number or there is an error with his phone number
      this.getPhone();
    } else {


      cordova.plugins.SignInWithApple.signin({ requestedScopes: [0] },
        (res) => {

          let userId = res.user;

          this.functionsService.presentLoading();

          this.dataService.appleLogin(userId)
            .subscribe((users: User[]) => {
              if (users.length != 0) {
                this.storage.set('user', users[0])
                  .then(() => {
                    this.functionsService.dismissLoading();
                    this.events.publish('user');
                    this.navCtrl.setRoot('HomePage');
                  });

              } else {
                this.functionsService.dismissLoading();
                this.customer = {
                  name: res.fullName.givenName + ' ' + res.fullName.familyName,
                  image: '',
                  phone: '',
                  appleUserId: userId
                };

                //get phone number
                this.getPhone();

              }
            }, err => {
              this.functionsService.dismissLoading();
              let msg = this.translationService.translate('MESSAGES.error')
              this.functionsService.presentToast(msg);
            })

        },
        (err) => {
          alert(JSON.stringify(err));
          let msg = this.translationService.translate('MESSAGES.error')
          this.functionsService.presentToast(msg);
        }
      )


    }

  }


  facebookLogin() {

    if (this.customer) {
      //this means that he has logged in , but not enter phone number or there is an error with his phone number
      this.getPhone();
    } else {
      let permissions = ['public_profile']
      this.facebook.login(permissions)
        .then((res: FacebookLoginResponse) => {
          let userId = res.authResponse.userID;

          this.functionsService.presentLoading();
          this.dataService.fblogin(userId)
            .subscribe((users: User[]) => {
              if (users.length != 0) {
                this.storage.set('user', users[0])
                  .then(() => {
                    this.functionsService.dismissLoading();
                    this.events.publish('user');
                    this.navCtrl.setRoot('HomePage');
                  });

              } else {
                //Getting name and image properties
                this.facebook.api("/me?fields=name", permissions)
                  .then(user => {
                    this.functionsService.dismissLoading();

                    user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                    this.customer = {
                      name: user.name,
                      image: user.picture,
                      phone: '',
                      facebookUserId: userId
                    };

                    //get phone number
                    this.getPhone();
                  })
                  .catch(e => {
                    //alert('Error facebook api : ' + JSON.stringify(e))
                    this.functionsService.dismissLoading();
                    let msg = this.translationService.translate('MESSAGES.error')
                    this.functionsService.presentToast(msg);
                  });


              }
            }, err => {
              this.functionsService.dismissLoading();
              let msg = this.translationService.translate('MESSAGES.error')
              this.functionsService.presentToast(msg);
            })


        })
        .catch(e => {
          //alert('Error logging into Facebook : ' + JSON.stringify(e))
          let msg = this.translationService.translate('MESSAGES.error')
          this.functionsService.presentToast(msg);
        });
    }

  }



  getPhone() {
    let phoneAlert = this.translationService.translate('MESSAGES.phoneAlert');
    let alert = this.alertCtrl.create({
      title: phoneAlert.title,
      message: phoneAlert.message,
      mode: 'ios',
      inputs: [
        {
          name: 'phone',
          type: 'number',
          placeholder: phoneAlert.placeholder
        }
      ],
      buttons: [
        {
          text: phoneAlert.cancel,
          role: 'cancel'
        },
        {
          text: phoneAlert.ok,
          handler: () => {
            alert.onDidDismiss(data => {
              if (data && data.phone && data.phone.trim() != '') {

                //validate phone number according to market country codes
                let number;
                let isValidPhone = false;
                MARKET.countryCodes.forEach((code: CountryCode) => {
                  let phone = parsePhoneNumberFromString(data.phone, code);
                  if (phone.isValid()) {
                    isValidPhone = true;
                    number = phone.number;
                  }
                });

                if (!isValidPhone || !number) {
                  let msg = this.translationService.translate('MESSAGES.phoneErr')
                  return this.functionsService.presentToast(msg)
                }

                this.customer.phone = number;
                this.saveCustomer();


              }
            })
          }
        }
      ]
    });

    alert.present();
  }

  saveCustomer() {
    this.functionsService.presentLoading();
    this.dataService.newCustomer(this.customer)
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
      });
  }

  //watch lang change
  watchLang() {
    this.translationService.translateService.onLangChange
      .subscribe((ev: LangChangeEvent) => {
        this.direction = this.translationService.getDirection();
      })
  }


}
