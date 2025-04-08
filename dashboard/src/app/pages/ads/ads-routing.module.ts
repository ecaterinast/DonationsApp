import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { AdsComponent } from './ads/ads.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {path : '' , component : AdsComponent},
  {path : 'add' , component : AddComponent},
  {path : 'edit/:id' , component : EditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdsRoutingModule { }
