import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbToastrModule, NbListModule, NbUserModule, NbIconModule, NbButtonModule, NbInputModule, NbSpinnerModule, NbSelectModule} from '@nebular/theme';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const material = [NbCardModule , NbToastrModule , Ng2SmartTableModule , NbListModule , NbUserModule , 
                    NbIconModule , NbButtonModule , NbInputModule  , ReactiveFormsModule ,
                  NbSpinnerModule , NbSelectModule , FormsModule]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    material
  ],
  exports : [material]
})
export class MaterialModule { }
