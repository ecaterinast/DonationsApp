import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { MaterialModule } from '../../material/material.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CustomersComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MaterialModule,
    TranslateModule
  ]
})
export class CustomersModule { }
