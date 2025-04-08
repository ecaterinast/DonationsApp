import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../shared/product';
import { Order } from '../../shared/order';
import { User } from '../../shared/user';
import { Rating } from '../../shared/rating';
import { OrderStatus } from '../../shared/orderStatus';
import { MARKET } from '../../shared/config';
import { take } from 'rxjs/operators';


@Injectable()
export class DataProvider {

  // baseURL: string = 'http://localhost:3014/api/';
  baseURL: string = MARKET.baseURL;


  constructor(public http: HttpClient) {
    console.log('Hello DataProvider Provider');
  }

  //categories
  getCategories() {
    return this.http.get(this.baseURL + 'categories?filter=' + JSON.stringify({ include: 'subcategories' })).pipe(take(1))
  }

  //ads
  getAds() {
    return this.http.get(this.baseURL + 'ads?filter=' + JSON.stringify({ include: 'product' })).pipe(take(1))
  }

  //products
  getProducts() {
    return this.http.get(this.baseURL + 'products?filter=' + JSON.stringify({ include: 'ratings', order: "createdAt DESC", where: { available: true } })).pipe(take(1))
  }

  getProduct(id: number) {
    return this.http.get(this.baseURL + `products/${id}?filter=${JSON.stringify({ include: 'ratings' })}`).pipe(take(1))
  }

  updateProduct(id: number, product: Product) {
    return this.http.put(this.baseURL + `products/${id}`, product).pipe(take(1))
  }

  getProductsWithLimit(skip: number) {
    return this.http.get(this.baseURL + 'products?filter=' + JSON.stringify({ include: 'ratings', order: "createdAt DESC", skip, limit: 20, where: { available: true } })).pipe(take(1))
  }

  getOffers(skip: number, priceOrder?: string) {
    let order = priceOrder ? `price ${priceOrder}` : 'createdAt DESC';
    return this.http.get(this.baseURL + 'products?filter=' + JSON.stringify({ where: { discount: { gt: 0 }, available: true }, include: 'ratings', order, skip, limit: 20 })).pipe(take(1))
  }


  getProductsByCategory(skip: number, category: string, priceOrder?: string) {
    let order = priceOrder ? `price ${priceOrder}` : 'createdAt DESC';
    return this.http.get(`${this.baseURL}products?filter=${JSON.stringify({ include: 'ratings', where: { categoryId: category, available: true }, order, skip, limit: 20 })}`).pipe(take(1))
  }

  getProductsBySubCategory(skip: number, sub: string, priceOrder?: string) {
    let order = priceOrder ? `price ${priceOrder}` : 'createdAt DESC';
    return this.http.get(`${this.baseURL}products?filter=${JSON.stringify({ include: 'ratings', where: { subcategoryId: sub, available: true }, order, skip, limit: 20 })}`).pipe(take(1))
  }

  getProductsByBrand(skip: number, brand: string, priceOrder?: string) {
    let order = priceOrder ? `price ${priceOrder}` : 'createdAt DESC';
    return this.http.get(`${this.baseURL}products?filter=${JSON.stringify({ include: 'ratings', where: { brandId: brand, available: true }, order, skip, limit: 20 })}`).pipe(take(1))
  }



  //new rating
  addRating(rating: Rating) {
    return this.http.post(this.baseURL + 'ratings', rating).pipe(take(1))
  }

  getRating(productId: string) {
    return this.http.get(this.baseURL + `ratings?filter=${JSON.stringify({ where: { productId: productId }, include: 'customer' })}`).pipe(take(1))
  }

  //countries
  getCountries() {
    return this.http.get(this.baseURL + 'countries?filter=' + JSON.stringify({ order: "createdAt DESC" })).pipe(take(1))
  }

  //orders
  cashOrder(order: Order) {
    return this.http.post(this.baseURL + 'orders', order).pipe(take(1))
  }

  getOrdersCount() {
    return this.http.get(this.baseURL + `orders/count`).pipe(take(1))
  }

  getOrders(customerId: string) {
    return this.http.get(this.baseURL + `customers/${customerId}/orders?filter=${JSON.stringify({ order: "createdAt DESC" })}`).pipe(take(1))
  }

  //customer
  login(cred) {
    return this.http.post(this.baseURL + 'users/login', cred).pipe(take(1))
  }

  getCustomer(id: string) {
    return this.http.get(this.baseURL + `customers?filter=${JSON.stringify({ where: { owner: id } })}`).pipe(take(1))
  }

  newUser(cred) {
    return this.http.post(this.baseURL + 'users', cred).pipe(take(1))
  }

  newCustomer(user: User) {
    return this.http.post(this.baseURL + 'customers', user).pipe(take(1))
  }

  editCustomer(user: User) {
    return this.http.put(this.baseURL + `customers/${user.id}`, user).pipe(take(1))
  }

  resetPassword(email: string) {
    return this.http.post(this.baseURL + 'reset-password-request', { email: email }).pipe(take(1))
  }

  //upload
  upload(file) {
    let fd = new FormData();
    fd.append('file', file);
    return this.http.post(this.baseURL + 'containers/users/upload', fd).pipe(take(1))
  }


  //get app home design
  getSliders() {
    return this.http.get(this.baseURL + 'sliders?filter=' + JSON.stringify({ include: 'product' })).pipe(take(1))
  }


  getBanners() {
    return this.http.get(this.baseURL + 'banners?filter=' + JSON.stringify({ include: 'product' })).pipe(take(1))
  }


  getFeaturedProducts() {
    return this.http.get(this.baseURL + 'products?filter=' + JSON.stringify({ include: 'ratings', where: { featured: true, available: true } })).pipe(take(1))
  }


  getHomeCategories() {
    return this.http.get(this.baseURL + 'homeCategories?filter=' + JSON.stringify({ include: 'categories' })).pipe(take(1))
  }

  //copoun
  getCopoun(code: string) {
    return this.http.get(this.baseURL + 'copouns?filter=' + JSON.stringify({ where: { code: code }, order: "createdAt DESC" })).pipe(take(1))
  }

  //shipping zones
  getZonnes() {
    return this.http.get(this.baseURL + 'shippings').pipe(take(1))
  }

  //search products
  search(skip: number, name: string) {
    return this.http.get(this.baseURL + 'products?filter=' + JSON.stringify({ include: 'ratings', where: { name: { regexp: `/${name}/i` }, available: true }, order: "createdAt DESC", skip, limit: 20 })).pipe(take(1))
  }

  //get category
  getCateogry(categoryId) {
    return this.http.get(this.baseURL + `categories/${categoryId}?filter=${JSON.stringify({ include: 'subcategories' })}`).pipe(take(1))
  }


  //get brand
  getBrand(brandId) {
    return this.http.get(this.baseURL + `brands/${brandId}`).pipe(take(1))
  }

  //facebook login
  fblogin(userId) {
    return this.http.get(this.baseURL + `customers?filter=${JSON.stringify({ where: { facebookUserId: userId } })}`).pipe(take(1))
  }


  //apple login
  appleLogin(userId) {
    return this.http.get(this.baseURL + `customers?filter=${JSON.stringify({ where: { appleUserId: userId } })}`).pipe(take(1))
  }

  //About info
  getAboutInfo() {
    return this.http.get(this.baseURL + 'contacts').pipe(take(1))
  }

  //cancel order
  cancelOrder(order: Order) {
    localStorage.setItem('order', JSON.stringify(order));
    let localOrder: Order = JSON.parse(localStorage.getItem('order'));
    localOrder.products.forEach(prod => {
      delete prod.details;
    });
    localOrder.status = OrderStatus.cancelled;
    return this.http.put(this.baseURL + 'orders', localOrder).pipe(take(1))
  }

  //get order product
  getOrderProducts(products: any[]) {
    var promise = new Promise((resolve, reject) => {
      let finalProducts = [];
      products.forEach(product => {
        //convert object values to array
        if (product.orderedVariables) {
          product.orderedVariables = Object.keys(product.orderedVariables).map(function (key) {
            return product.orderedVariables[key];
          });
        }
        //get product details 
        this.http.get(`${this.baseURL}products/${product.id}?filter=${JSON.stringify({ include: "ratings" })}`)
          .pipe(take(1))
          .subscribe((res) => {
            product.details = res;
            finalProducts.push(product);
            if (finalProducts.length == products.length) {
              resolve(finalProducts);
            }
          }, err => {
            reject(err);
          });

      })
    });

    return promise;
  }


  //get cart product
  getCartProducts(products: any[]) {
    var promise = new Promise((resolve, reject) => {
      if (products.length == 0) resolve([]);
      let finalProducts = [];
      products.forEach(product => {
        this.http.get(`${this.baseURL}products/${product.id}?filter=${JSON.stringify({ include: "ratings" })}`)
          .pipe(take(1))
          .subscribe((res) => {
            product.details = res;
            finalProducts.push(product);
            if (finalProducts.length == products.length) {
              resolve(finalProducts);
            }
          }, err => {
            reject(err);
          });

      })
    });

    return promise;
  }

  //brands
  getBrands() {
    return this.http.get(this.baseURL + 'brands').pipe(take(1))
  }
}
