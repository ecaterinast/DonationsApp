import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimilarPage } from './similar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SimilarPage,
  ],
  imports: [
    IonicPageModule.forChild(SimilarPage),
    TranslateModule.forChild()
  ],
})
export class SimilarPageModule {}
