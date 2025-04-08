import { Component, OnInit } from '@angular/core';
import { FunctionsService } from 'src/app/providers/functions/functions.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/providers/data/data.service';
import { NavController } from '@ionic/angular';
import { Order } from 'src/shared/order';
import { Storage } from '@ionic/storage';
import { OrderStatus } from "../../../shared/orderStatus";
import { OrderService } from 'src/app/providers/order/order.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  direction: string;
  limit: number = 20;
  loading: boolean;
  orders: Order[];
  filter: boolean;
  status = OrderStatus;
  selectedStatus: string;
  date: Date;
  searchFilter: any;
  code: number;


  constructor(private dataService: DataService, private functionsService: FunctionsService,
    private translateService: TranslateService, private navCtrl: NavController,
    private orderService: OrderService) { }

  ngOnInit() {
    this.getDirection();
    this.getOrders();
    this.deleteOrder();
  }

  getDirection() {
    this.functionsService.getDirection()
      .subscribe(dir => this.direction = dir);
  }

  //get orders
  getOrders(event?: any) {
    if (!event) this.loading = true;
    this.dataService.getData(`orders?filter=${JSON.stringify({ where: { status: OrderStatus.waiting }, limit: this.limit, order: 'createdAt DESC' })}`)
      .subscribe((orders: Order[]) => {
        event ? event.target.complete() : this.loading = false;
        this.orders = orders;
      }, err => {
        event ? event.target.complete() : this.loading = false;
        this.functionsService.presentToast(this.translateService.instant('MESSAGES.error'));
      })
  }

  //refresher
  onRefresh(ev) {
    this.searchFilter ? this.startFilter(ev) : this.getOrders(ev);
  }

  //infinite scroll
  more(ev) {
    this.limit += 20;
    this.searchFilter ? this.startFilter(ev) : this.getOrders(ev);
  }

  //track fn
  trackFn(order) {
    return order.id
  }


  //order detail
  detail(id, index) {
    this.orderService.index = index;
    this.navCtrl.navigateForward('order-detail/' + id)
  }

  //delete order from list if it's status changed
  deleteOrder() {
    this.orderService.watchDeleteOrders()
    .subscribe(index => {
      if (index != undefined) {
        this.orders.splice(index, 1);
      }
    });
  }


  //bottom sheet
  toggleFilter() {
    this.filter = !this.filter;
  }

  //search
  search() {
    if (!this.selectedStatus && !this.date && !this.code) return;
    this.filter = false;

    if (this.date) {
      let date = new Date(this.date);
      this.searchFilter = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      }
    }

    if (this.selectedStatus) {
      this.searchFilter = {
        ...this.searchFilter,
        status: this.selectedStatus
      }
    }

    if (this.code) {
      this.searchFilter = {
        ...this.searchFilter,
        code: this.code
      }
    }
    this.limit = 20;
    this.startFilter();
  }

  //filter orders
  startFilter(event?: any) {
    if (!event) this.loading = true;
    this.dataService.getData(`orders?filter=${JSON.stringify({ where: this.searchFilter, limit: this.limit })}`)
      .subscribe((orders: Order[]) => {
        event ? event.target.complete() : this.loading = false;
        this.orders = orders;
      }, err => {
        event ? event.target.complete() : this.loading = false;
        this.functionsService.presentToast(this.translateService.instant('MESSAGES.error'));
      });
  }

  //reset Filter
  resetFilter() {
    this.filter = false;
    this.searchFilter = undefined;
    this.date = undefined;
    this.selectedStatus = undefined;
    this.code = undefined;
    this.limit = 20;
    this.getOrders();
  }
}
