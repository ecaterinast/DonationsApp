import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule , HttpClient } from '@angular/common/http';

//native

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FCM } from '@ionic-native/fcm';
import { Facebook } from '@ionic-native/facebook';



//app
import { MyApp } from './app.component';
import { DataProvider } from '../providers/data/data';
import { FunctionsProvider } from '../providers/functions/functions';
import { CartProvider } from '../providers/cart/cart';
import { FavouritesProvider } from '../providers/favourites/favourites';
import { TranslationProvider } from '../providers/translation/translation';


//translation
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp ,  {
      backButtonText: '',
      scrollPadding : false,
      scrollAssist : false
    }),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    FunctionsProvider,
    CartProvider,
    FavouritesProvider,
    SocialSharing,
    TranslationProvider,
    FCM , 
    Facebook
  ]
})
export class AppModule {}
