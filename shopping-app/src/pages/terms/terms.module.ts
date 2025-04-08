import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsPage } from './terms';

@NgModule({
  declarations: [
    TermsPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsPage),
    TranslateModule.forChild()
  ],
})
export class TermsPageModule {}
