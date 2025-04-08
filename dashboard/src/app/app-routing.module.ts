import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NbAuthComponent } from '@nebular/auth';


const routes: Routes = [
  {
    path : 'policy/:policyType',
    component : NbAuthComponent,
    loadChildren: () => import('./policy/policy.module').then(m => m.PolicyModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'login',
    component : NbAuthComponent,
    loadChildren : () => import('./login/login.module').then(m => m.LoginModule)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
