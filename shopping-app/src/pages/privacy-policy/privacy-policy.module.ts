import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPolicyPage } from './privacy-policy';

@NgModule({
  declarations: [
    PrivacyPolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPolicyPage),
     TranslateModule.forChild()
  ],
})
export class PrivacyPolicyPageModule {}
