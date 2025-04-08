import { FunctionsService } from '../../../services/functions/functions.service';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { OrderStatus } from '../../../../shared/orderStatus';
import { Order } from '../../../../shared/order';
import { Stock } from '../../../../shared/stock';
import { NbDialogService } from '@nebular/theme';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  selector: 'ngx-dashboard',
  styleUrls : ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  
  customers : number;
  products : number;
  //credit
  outCredit : number;
  inCredit : number;
  allCredit : number;
  //orders
  completedOrders : number;
  cancelledOrders : number;
  waitingOrders : number;
  //stock
  stocks : Stock[];

  currentDate : Date = new Date();




  constructor(private dataService : DataService , private functionsService : FunctionsService ,
    private translateService : TranslateService , private nbDialogService : NbDialogService) {
    

  }

  ngOnInit() {    
    this.getCustomers();
    this.getProducts();
    this.getOrdersCount();
    this.getOrdersCredit();
    this.getStock();
  }



 
  //customers section
  getCustomers() {
    this.dataService.getData(`customers/count`)
      .subscribe((res : any) => {
        this.customers = res.count;
      } )
  }


  //products section
  getProducts() {
    this.dataService.getData(`products/count`)
      .subscribe((res : any) => {
        this.products = res.count;
      })
  }

  //orders section
  getOrdersCount() {
    this.dataService.getData(`stats/orders-count`)
      .subscribe((res : any) => {
        this.completedOrders = res.completedOrders;
        this.waitingOrders = res.waitingOrders;
        this.cancelledOrders = res.cancelledOrders;
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') ,'');
      })
  }

  
 


  //credit section
  getOrdersCredit() {
    this.dataService.getData(`stats/orders-credit`)
      .subscribe((res : any) => {
        this.inCredit = res.inCredit;
        this.outCredit = res.outCredit;
        this.allCredit = this.inCredit + this.outCredit;
      });
  }



  //stock section
  getStock() {
    this.dataService.getData(`stocks?filter=${JSON.stringify({where : {stock : {lte : 10}} , include :['product']})}`)
      .subscribe((stocks : Stock[]) => {
        this.stocks = stocks;
      });

  }

  deleteStockAlert(index) {
    this.stocks.splice(index , 1);
  }

  deleteStock(index) {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.dataService.deleteData(`stocks/${this.stocks[index].id}`)
        .subscribe(res => {
          this.stocks.splice(index , 1);
          this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.deleted') ,'');

        } , err => {
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') ,'');
        })
    }
  } 

  productDetails(product) {
    this.dataService.navParams.product = product;
    let dialogRef = this.nbDialogService.open(ProductDetailComponent);

    dialogRef.onClose.subscribe(res => {
      this.dataService.navParams = {}
    })
  }



}
