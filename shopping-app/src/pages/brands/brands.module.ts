import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { BrandsPage } from './brands';

@NgModule({
  declarations: [
    BrandsPage,
  ],
  imports: [
    IonicPageModule.forChild(BrandsPage),
    TranslateModule.forChild()
  ],
})
export class BrandsPageModule {}
