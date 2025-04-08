import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './providers/data/data.service';
import { FunctionsService } from './providers/functions/functions.service';
import { IonicStorageModule } from '@ionic/storage';

//fcm
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

//call phone number
import { CallNumber } from '@ionic-native/call-number/ngx';

//in-app-browser
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';



//translation
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OrderService } from './providers/order/order.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      backButtonText  : ''
    }),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DataService,
    FunctionsService,
    OrderService,
    FCM,
    CallNumber,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
