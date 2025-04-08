import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact/contact.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    ContactRoutingModule,
    TranslateModule,
    MaterialModule
  ]
})
export class ContactModule { }
