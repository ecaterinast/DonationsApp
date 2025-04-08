import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateProfilePage } from './create-profile';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateProfilePage),
    TranslateModule.forChild()
  ],
})
export class CreateProfilePageModule {}
