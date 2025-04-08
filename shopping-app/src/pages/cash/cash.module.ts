import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashPage } from './cash';
import { IonicStepperModule } from 'ionic-stepper';



@NgModule({
  declarations: [
    CashPage,
  ],
  imports: [
    IonicPageModule.forChild(CashPage),
    IonicStepperModule,
    TranslateModule.forChild()
  ],
})
export class CashPageModule {}
