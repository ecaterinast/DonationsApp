import { AddComponent } from './add/add.component';
import { CustomersComponent } from './customers/customers.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path : '',
    component : CustomersComponent
  },
  {path : 'add' , component : AddComponent} ,
  {path : 'edit' , component : EditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
