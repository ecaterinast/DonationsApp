import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VariablesComponent } from './variables/variables.component';
import { VariableModifyComponent } from './variable-modify/variable-modify.component';

const routes: Routes = [
  {path : '' , component : VariablesComponent},
  {path : 'modify' , component : VariableModifyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariablesRoutingModule { }
