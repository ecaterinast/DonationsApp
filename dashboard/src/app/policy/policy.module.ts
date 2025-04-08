import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy/policy.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [PolicyComponent],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    MaterialModule
    
  ]
})
export class PolicyModule { }
