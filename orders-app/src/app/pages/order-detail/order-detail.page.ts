import { Component, OnInit } from '@angular/core';
import { Order } from 'src/shared/order';
import { DataService } from 'src/app/providers/data/data.service';
import { FunctionsService } from 'src/app/providers/functions/functions.service';
import { TranslateService } from '@ngx-translate/core';
import { OrderStatus } from 'src/shared/orderStatus';
import { OrderService } from 'src/app/providers/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  order : Order;
  direction : string;
  segment : string = 'products';
  lang: string;
  status = OrderStatus;
  loading : boolean;
  
  constructor(public dataService : DataService , private functionsService : FunctionsService , 
    private translateService : TranslateService , private orderService : OrderService ,
    private route : ActivatedRoute, private callNumber: CallNumber) { }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.functionsService.getDirection()
      .subscribe(dir => this.direction = dir);
    this.getOrder();

  }


  segmentChanged(ev) {    
    this.segment = ev.detail.value
  }

  getOrder(refresherEvent? : any) {
    let id = this.route.snapshot.params.id;
    if(!refresherEvent)this.loading = true;
    this.orderService.getOrder(id)
      .then((order : Order) => {
        refresherEvent? refresherEvent.target.complete() : this.loading = false;
        this.order = order;
      })
      .catch(err => {
        refresherEvent? refresherEvent.target.complete() : this.loading = false;
        this.functionsService.presentToast( this.translateService.instant('MESSAGES.error'));
      })
  }


  editOrder(status: OrderStatus) {
    this.functionsService.presentLoading();
    this.orderService.editOrder(status , this.order)
      .then(res => {
        this.functionsService.dismissLoading();
        this.order.status = status;
        this.functionsService.presentToast( this.translateService.instant('MESSAGES.saved'));
        this.orderService.delete();
      })
      .catch(err => {
        this.functionsService.dismissLoading();
        this.functionsService.presentToast( this.translateService.instant('MESSAGES.error'));
      })
  }

  //call phone
  call() {
    this.callNumber.callNumber(this.order.phone, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  
}
