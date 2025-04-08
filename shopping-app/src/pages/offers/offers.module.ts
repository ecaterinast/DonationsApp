import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { OffersPage } from './offers';

@NgModule({
  declarations: [
    OffersPage,
  ],
  imports: [
    IonicPageModule.forChild(OffersPage),
    TranslateModule.forChild()
  ],
})
export class OffersPageModule {}
