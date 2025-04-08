import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdsRoutingModule } from './ads-routing.module';
import { AdsComponent } from './ads/ads.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [AdsComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    AdsRoutingModule,
    MaterialModule,
    TranslateModule
  ]
})
export class AdsModule { }
