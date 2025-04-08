import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { AdPage } from './ad';

@NgModule({
  declarations: [
    AdPage,
  ],
  imports: [
    IonicPageModule.forChild(AdPage),
    TranslateModule.forChild()
  ],
})
export class AdPageModule {}
