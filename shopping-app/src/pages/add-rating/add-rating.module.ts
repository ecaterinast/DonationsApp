import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRatingPage } from './add-rating';
import { RatingModule} from 'ng-starrating'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddRatingPage,
  ],
  imports: [
    IonicPageModule.forChild(AddRatingPage),
    RatingModule,
    TranslateModule.forChild()
  ],
})
export class AddRatingPageModule {}
