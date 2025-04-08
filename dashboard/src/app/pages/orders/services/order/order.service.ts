import { Injectable } from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { Copoun } from '../../../../../shared/copoun';
import { Order, OrderProduct } from '../../../../../shared/order';
import { OrderStatus } from '../../../../../shared/orderStatus';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  oldOrderStatus: string;

  constructor(private dataService: DataService) {

  }

  //get order details functions

  getOrder(orderId) {
    var promise = new Promise((resolve, reject) => {
      this.dataService.getData('orders/' + orderId)
        .subscribe((order: Order) => {
        
          //get products
          this.getProductsDetails(order.products)
            .then((products : OrderProduct[]) => {
               //update price if there is variables with additional cost
               products.forEach(product => {
                if (product.orderedVariables) {
                  product.orderedVariables.forEach(value => {
                    if (value.price) {
                      product.details.price += value.price;
                    }
                  })
                }
              })
              
              order.products = products;
              //check for copouns  
              if (order.copounId.length != 0) {
                this.getCopoun(order.copounId)
                  .then((copoun: Copoun) => {
                    order.copoun = copoun;
                    resolve(order);
                  })
                  .catch(err => reject(err));

              } else {
                resolve(order);
              }
            })
            .catch(err => reject(err));
          
        }, err => {
          reject(err);
        })
    });

    return promise;
  }

  //get copoun details
  getCopoun(copounId) {
    var promise = new Promise((resolve, reject) => {
      this.dataService.getData('copouns/' + copounId)
        .subscribe((res: Copoun) => {
          resolve(res);
        }, err => {
          reject(err);
        })
    });

    return promise;
  }

  //prepare products structure to fit fit order model
  //convert product orderedVariables to array
  //get product details like name , desc , ...etc and stock
  getProductsDetails(products: any[]) {
    var promise = new Promise((resolve, reject) => {
      let finalProductsWithStocks = [];
      products.forEach(product => {
        //convert object values to array
        if (product.orderedVariables) {
          product.orderedVariables = Object.values(product.orderedVariables);
        }
        //get product details and stock
        this.dataService.getData(`products/${product.id}?filter=${JSON.stringify({include : ['stocks']})}`)
          .subscribe((res) => {
            product.details = res;
            finalProductsWithStocks.push(product);
            if (finalProductsWithStocks.length == products.length) {
              resolve(products);
            }
          }, err => {
            reject(err);
          });
        
      })
    });

    return promise;
  }

  //edit order functions
  editOrder(status: OrderStatus, order: Order) {
    var promise = new Promise((resolve, reject) => {
      this.oldOrderStatus = order.status;
      //delete product details from order before save
      localStorage.setItem('order' , JSON.stringify(order));
      let editedOrder : Order = JSON.parse(localStorage.getItem('order'));
      editedOrder.products.forEach(product => {
        delete product.details;
      });
      editedOrder.status = status;
      
      this.dataService.updateData('orders', editedOrder)
      .subscribe(res => {
        if (status == OrderStatus.completed) {
          resolve(res);
        } else {
          Promise.all([this.pushNotifications(status, order.customerId), this.updateStock(status, order.products)])
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            })
        }
          
      }, err => {
        reject(err);
      });
      
    });

    return promise;
  }

  pushNotifications(status, customerId) {
    var promise = new Promise((resolve, reject) => {

      let notifications = [];

      if (status == OrderStatus.confirmed) {
        //English notification
        // notifications.push({
        //   to: 'customers-' + customerId,
        //   title: 'order status',
        //   body: 'your order has been confirmed . wait us we will arrive asap'
        // });

        //Arabic Notification
        notifications.push({
          to: 'customers-' + customerId,
          title: 'حالة الطلب',
          body: 'تم تأكيد طلبك . سنصل في أقرب وقت ممكن'
        });

      }

      if (status == OrderStatus.cancelled) {
        //English notification
        // notifications.push({
        //   to: 'customers-' + customerId ,
        //   title: 'order status',
        //   body: 'your order has been cancelled'
        // });

        //Arabic Notification
        notifications.push({
          to: 'customers-' + customerId,
          title: 'حالة الطلب',
          body: 'تم الغاء طلبك'
        });

      }


      let requests = [];
      notifications.forEach(notification => {
        requests.push(this.dataService.postData('notifications/send', notification))
      });

      forkJoin(requests).subscribe(res => {
        resolve(true)
      }, err => {
        reject(err);
      });


    });

    return promise;

  }



  updateStock(status: OrderStatus, products: OrderProduct[]) {
    var promise = new Promise((resolve, reject) => {

      let increase: boolean;
      if (status == OrderStatus.confirmed) {
        increase = false;
      }
      else if (status == OrderStatus.cancelled && this.oldOrderStatus == OrderStatus.confirmed) {
        increase = true;
      }
      else if (status == OrderStatus.cancelled && this.oldOrderStatus == OrderStatus.waiting) {
        resolve(true);
      }

      products.forEach(product => {
        let stocks = product.details.stocks;
        let variables = product.orderedVariables;
        stocks.forEach((stock) => {
          if (stock.name == 'all') {
            increase ? stock.stock += product.amount : stock.stock -= product.amount
          }
          else {
            variables.forEach(variable => {
                if (variable.name == stock.name) {                  
                  increase ? stock.stock += product.amount : stock.stock -= product.amount
                }
            })
          }
        });

        let requests = [];
        stocks.forEach(stock => {
          requests.push(
            this.dataService.updateData('stocks', stock)
          );
        })
        forkJoin(requests).subscribe(res => {
          resolve(true)
        }, err => {
          reject(err);
        })

      });


    });

    return promise;
  }



}
