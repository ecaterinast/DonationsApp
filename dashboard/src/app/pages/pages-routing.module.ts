import { AdminGuard } from './../guards/admin.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      loadChildren : () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'customers',
      loadChildren : () => import('./customers/customers.module').then(m => m.CustomersModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'products',
      loadChildren : () => import('./products/products.module').then(m => m.ProductsModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'categories',
      loadChildren : () => import('./categories/categories.module').then(m => m.CategoriesModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'brands',
      loadChildren : () => import('./brands/brands.module').then(m => m.BrandsModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'ads',
      loadChildren : () => import('./ads/ads.module').then(m => m.AdsModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'orders',
      loadChildren : () => import('./orders/orders.module').then(m => m.OrdersModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'shipping',
      loadChildren : () => import('./shipping/shipping.module').then(m => m.ShippingModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'copouns',
      loadChildren : () => import('./copouns/copouns.module').then(m => m.CopounsModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'mobile',
      loadChildren : () => import('./mobile/mobile.module').then(m => m.MobileModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'fcm',
      loadChildren : () => import('./notifications/notifications.module').then(m => m.NotificationsModule),
      canActivate : [AuthGuard]
    },
    {
      path: 'contact',
      loadChildren : () => import('./contact/contact.module').then(m => m.ContactModule),
      canActivate : [AuthGuard]
    },

    {
      path: 'variables',
      loadChildren : () => import('./variables/variables.module').then(m => m.VariablesModule),
      canActivate : [AuthGuard]
    },  
    {
      path: 'settings',
      loadChildren : () => import('./settings/settings.module').then(m => m.SettingsModule),
      canActivate : [AdminGuard]
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
