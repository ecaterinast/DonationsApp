import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';

@NgModule({
  declarations: [
    CategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesPage),
    TranslateModule.forChild()
  ],
})
export class CategoriesPageModule {}
