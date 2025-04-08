import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { MobileComponent } from './mobile/mobile.component';

const routes: Routes = [
  {path : '' , component : MobileComponent},
  {path : 'add/:type' , component : AddComponent},
  {path : 'edit/:type/:id' , component : EditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
