import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CopounsComponent } from './copouns/copouns.component';

const routes: Routes = [
  {path:''  , component : CopounsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopounsRoutingModule { }
