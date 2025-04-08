import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { MaterialModule } from '../../material/material.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { NbDatepickerModule } from '@nebular/theme';
import { OrderService } from './services/order/order.service';

@NgModule({
  declarations: [OrdersComponent, OrderDetailComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MaterialModule,
    TranslateModule,
    NbDatepickerModule
  ],
  providers : [OrderService]
})
export class OrdersModule { }
