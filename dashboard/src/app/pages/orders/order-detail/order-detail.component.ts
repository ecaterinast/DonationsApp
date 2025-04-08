import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FunctionsService } from './../../../services/functions/functions.service';
import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../shared/order';
import { OrderStatus } from '../../../../shared/orderStatus';
import { DataService } from '../../../services/data/data.service';
import { Copoun } from '../../../../shared/copoun';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { Product } from '../../../../shared/product';
import { Stock } from '../../../../shared/stock';
import { OrderService } from '../services/order/order.service';

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  loading: boolean = false;
  status = OrderStatus;
  

  constructor(public dataService: DataService, private functionsService: FunctionsService,
    private route: ActivatedRoute, private location: Location, private translateService: TranslateService ,
    private orderService : OrderService) {
  }

  ngOnInit() {
    this.getOrder();
    
  }

  getOrder() {
    let id = this.route.snapshot.params.id;
    this.orderService.getOrder(id)
      .then((order : Order) => {        
        this.order = order;        
      } , err => {
        console.log('order detail error :');
        
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  editOrder(status: OrderStatus) {
    this.loading = true;
    this.orderService.editOrder(status , this.order)
      .then(res => {
        this.loading = false;
        this.order.status = status;
        this.functionsService.showToast('success', this.translateService.instant('MESSAGES.saved'), '');
      })
      .catch(err => {
        this.loading = false; 
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  back() {
    this.location.back();
  }



}
