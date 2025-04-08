import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryDetailPage } from './category-detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CategoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryDetailPage),
    TranslateModule.forChild()
  ],
})
export class CategoryDetailPageModule {}
