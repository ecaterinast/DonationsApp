import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZonesComponent } from './zones/zones.component';
import { ShippingRoutingModule } from './shipping-routing';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ZonesComponent],
  imports: [
    CommonModule,
    ShippingRoutingModule,
    MaterialModule,
    TranslateModule
  ]
})
export class ShippingModule { }
