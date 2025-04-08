import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CopounsRoutingModule } from './copouns-routing.module';
import { CopounsComponent } from './copouns/copouns.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NbDialogModule, NbDatepickerModule } from '@nebular/theme';
import { CopounModifyComponent } from './copoun-modify/copoun-modify.component';

@NgModule({
  declarations: [CopounsComponent , CopounModifyComponent],
  entryComponents : [CopounModifyComponent],
  imports: [
    CommonModule,
    CopounsRoutingModule,
    MaterialModule,
    TranslateModule,
    NbDialogModule.forChild(),
    NbDatepickerModule
  ]
})
export class CopounsModule { }
