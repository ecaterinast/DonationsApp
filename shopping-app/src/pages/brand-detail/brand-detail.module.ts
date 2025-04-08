import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { BrandDetailPage } from './brand-detail';

@NgModule({
  declarations: [
    BrandDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BrandDetailPage),
    TranslateModule
  ],
})
export class BrandDetailPageModule {}
