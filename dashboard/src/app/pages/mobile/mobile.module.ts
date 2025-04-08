import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileRoutingModule } from './mobile-routing.module';
import { MobileComponent } from './mobile/mobile.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [MobileComponent,AddComponent , EditComponent],
  entryComponents : [],
  imports: [
    CommonModule,
    MobileRoutingModule,
    MaterialModule,
    TranslateModule
  ]
})
export class MobileModule { }
