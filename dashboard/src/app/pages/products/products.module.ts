import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products/products.component';
import { MaterialModule } from '../../material/material.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NbCheckboxModule, NbStepperModule  } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProductsComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule,
    NbStepperModule,
    TranslateModule,
    NbCheckboxModule
  ]
})
export class ProductsModule { }
