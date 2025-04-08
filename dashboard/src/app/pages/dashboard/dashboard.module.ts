import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NbDialogModule } from '@nebular/theme';

@NgModule({
  declarations: [DashboardComponent, ProductDetailComponent],
  entryComponents : [ProductDetailComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    TranslateModule,
    NbDialogModule.forChild()
  ]
})
export class DashboardModule { }
