import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsEditPage } from './items-edit';

@NgModule({
  declarations: [
    ItemsEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemsEditPage),
  ],exports:[ItemsEditPage]
})
export class ItemsEditPageModule {}
