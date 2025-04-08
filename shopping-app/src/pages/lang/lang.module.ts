import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LangPage } from './lang';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LangPage,
  ],
  imports: [
    IonicPageModule.forChild(LangPage),
    TranslateModule.forChild()
  ],
})
export class LangPageModule {}
