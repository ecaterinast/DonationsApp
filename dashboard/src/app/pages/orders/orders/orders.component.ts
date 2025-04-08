import { FunctionsService } from './../../../services/functions/functions.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { Order } from '../../../../shared/order';
import { OrderStatus } from '../../../../shared/orderStatus';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  settings;
  source : LocalDataSource = new LocalDataSource();
  filter : boolean;
  status  = OrderStatus;
  orderStatus;
  date : Date;
  loading : boolean;

 
  constructor(private dataService : DataService , private functionsService : FunctionsService ,
    private router : Router , private translateService : TranslateService) { 

    }

  ngOnInit() {
    this.getOrders();
    this.initTableSettings()
    this.translateService.onLangChange.subscribe((event : LangChangeEvent) => {
        this.initTableSettings();
    })
  }


  initTableSettings(): void {
    this.settings = {
      actions : {
        add : false,
        edit : false,
        delete : false
      },
      columns : {
        code : {
          title : this.translateService.instant('FORM.code'),
          type : 'string'
        },
        name : {
          title : this.translateService.instant('FORM.name'),
          type : 'string'
        },
        phone : {
          title : this.translateService.instant('FORM.phone'),
          type : 'string'
        }
      },
      noDataMessage: this.translateService.instant('FORM.noData'),
    }
  } 


  getOrders() {
    this.dataService.getData(`orders?filter=${JSON.stringify({where : {status : OrderStatus.waiting}})}`)
      .subscribe((orders : Order[]) => {
        this.source.load(orders);
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }



  detail(ev) {
    this.router.navigateByUrl('/pages/orders/'+ev.data.id);
  }

  enableFilter() {
    this.filter = !this.filter;
  }

  search() {
    let searchFilter;
   
    if (this.date) {
      let date = new Date(this.date);
      searchFilter = {
        day : date.getDate(),
        month : date.getMonth() + 1,
        year : date.getFullYear()
      }
    }

    if (this.orderStatus) {
      searchFilter = {
        ...searchFilter,
        status : this.orderStatus
      }
    }
    console.log(searchFilter);
    this.loading = true;
    this.dataService.getData(`orders?filter=${JSON.stringify({where : searchFilter})}`)
    .subscribe((orders : Order[]) => {
      this.loading = false;
      this.source.load(orders);
    } , err => {
      this.loading = false;
      this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
    });
    
  }

 
 

}
