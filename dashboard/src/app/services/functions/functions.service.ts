import { Injectable } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition, NbMenuItem } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor( private toastrService: NbToastrService ) { }

  showToast(type: any, title : string , body: string ) {

    const config = {
      icon : 'bell-outline',
      status: type,
      position: NbGlobalPhysicalPosition.TOP_RIGHT
    };

    return this.toastrService.show( body, title , config);
  }

  getMENU(lang) : NbMenuItem[]{
   return  [
      {
        title: lang == 'en' ?'Dashboard' : 'الرئيسية',
        icon: 'home-outline',
        link: '/pages/dashboard',
        home: true,
      },
      {
        title: lang == 'en' ?'Customers' : 'العملاء',
        icon: 'people-outline',
        link: '/pages/customers'
      },
      {
        title: lang == 'en' ?'Products' : 'المنتجات',
        icon: 'gift-outline',
        link: '/pages/products'
      },
      {
        title: lang == 'en' ?'Orders' : 'الطلبات',
        icon: 'car-outline',
        link: '/pages/orders'
      }, 
      {
        title: lang == 'en' ?'Shipping Zones' : 'الشحن',
        icon: 'pin-outline',
        link: '/pages/shipping'
      }, 
      {
        title: lang == 'en' ?'Copouns' : 'كوبونات الخصم',
        icon: 'pricetags-outline',
        link: '/pages/copouns'
      }, 
      {
        title: lang == 'en' ?'mobile app' : 'تطبيق الموبايل',
        icon: 'smartphone-outline',
        link: '/pages/mobile'
      }, 
      {
        title: lang == 'en' ?'Notifications' : 'الاشعارات',
        icon: 'message-square-outline',
        link: '/pages/fcm'
      },
      
      {
        title: lang == 'en' ? 'Contact' : 'بيانات التواصل',
        icon: 'phone-call-outline',
        link: '/pages/contact'
      },
      {
        title: lang == 'en' ? 'Categories' : 'الأقسام',
        icon: 'layers-outline',
        link: '/pages/categories'
      },
      {
        title: lang == 'en' ? 'Brands' : 'العلامات التجارية',
        icon: 'pricetags-outline',
        link: '/pages/brands'
      },
      {
        title: lang == 'en' ? 'Ads' : 'الاعلانات',
        icon: 'award-outline',
        link: '/pages/ads'
      },
      {
        title: lang == 'en' ? 'Variables' : 'المتغيرات',
        icon: 'options-2-outline',
        link: '/pages/variables'
      },
      {
        title: lang == 'en' ? 'Settings' : 'الأعدادات',
        icon: 'settings-outline',
        link: '/pages/settings'
      }


    ];
  }

}
