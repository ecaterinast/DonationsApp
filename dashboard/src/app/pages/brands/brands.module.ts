import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands/brands.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NbDialogModule } from '@nebular/theme';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [BrandsComponent, AddComponent, EditComponent],
  entryComponents : [ AddComponent, EditComponent],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    MaterialModule,
    TranslateModule,
    NbDialogModule.forChild({})
  ]
})
export class BrandsModule { }
