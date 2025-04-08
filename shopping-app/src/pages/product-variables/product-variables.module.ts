import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductVariablesPage } from './product-variables';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProductVariablesPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductVariablesPage),
    TranslateModule.forChild()
  ],
})
export class ProductVariablesPageModule {}
