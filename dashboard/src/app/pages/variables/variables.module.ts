import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VariablesRoutingModule } from './variables-routing.module';
import { VariablesComponent } from './variables/variables.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { VariableModifyComponent } from './variable-modify/variable-modify.component';

@NgModule({
  declarations: [VariablesComponent, VariableModifyComponent],
  imports: [
    CommonModule,
    VariablesRoutingModule,
    MaterialModule,
    TranslateModule
  ]
})
export class VariablesModule { }
