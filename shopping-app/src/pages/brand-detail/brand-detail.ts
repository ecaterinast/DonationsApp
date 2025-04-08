import { Component, OnDestroy } from '@angular/core';
import { InfiniteScroll, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { CartProvider } from '../../providers/cart/cart';
import { DataProvider } from '../../providers/data/data';
import { FavouritesProvider } from '../../providers/favourites/favourites';
import { FunctionsProvider } from '../../providers/functions/functions';
import { TranslationProvider } from '../../providers/translation/translation';
import { Brand } from '../../shared/brand';
import { Product } from '../../shared/product';
import { Rating } from '../../shared/rating';


@IonicPage()
@Component({
  selector: 'page-brand-detail',
  templateUrl: 'brand-detail.html',
})
export class BrandDetailPage implements OnDestroy {

  cartNo: number;
  favouritesNo: number;
  skip = 0;
  loading: boolean = false;
  favourits: Product[] = [];
  products: Product[];
  brand: Brand;
  favoritesSubscription: Subscription;
  cartSubscription: Subscription;
  showFilter: boolean = false;
  priceOrder: string;
  direction: string;
  brandId : string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private cartService: CartProvider, private favouriteService: FavouritesProvider,
    public dataService: DataProvider, private translationService: TranslationProvider,
     private functionsService: FunctionsProvider,
  ) {

    this.favouritesNo = this.favouriteService.favourites;
    this.cartNo = this.cartService.products;

  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.brandId = this.navParams.get('brandId');
    this.getBrand();
    this.getProducts();
    this.watchFavourites();
    this.watchCart();
  }

  ngOnDestroy() {
    this.favoritesSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }


  //rating
  calcRating(ratings: Rating[]) {
    if (ratings.length == 0) return 0;
    let total = 0;
    ratings.forEach(rating => {
      total += rating.rating;
    })
    return (total / ratings.length);
  }

  getBrand() {
    this.dataService.getBrand(this.brandId) 
      .subscribe((brand : Brand) => {
       this.brand = brand;
      });
  }

  //products
  getProducts(refresher?: any) {
    if (!refresher) this.loading = true;
    this.dataService.getProductsByBrand(this.skip, this.brandId , this.priceOrder)
      .subscribe((products: Product[]) => {
        this.favouriteService.getFavourites()
          .then((favourites: Product[]) => {
            if (favourites) {
              this.favourits = favourites;
              this.favouritesNo = favourites.length;
              this.loading = false;
              this.products =  products 
            } else {
              this.loading = false;
              this.products =  products 
            }

            if (refresher) refresher.complete();
          })

      }, err => {
        if (refresher) refresher.complete();
        this.loading = false;
        this.functionsService.presentToast(err.message);
      });
  }


  trackByFun(product: Product) {
    return product.id;
  }

  isFavourite(product: Product) {
    let filter = this.favourits.filter(fav => { return fav.id == product.id });
    if (filter.length > 0) {
      return true;
    } else {
      return false;
    }
  }



  // for infinite scroll

  getMore(infiniteScroll: InfiniteScroll) {

    this.skip += 20;

    this.dataService.getProductsByBrand(this.skip, this.brand.id , this.priceOrder)
      .subscribe((products: Product[]) => {
        infiniteScroll.complete();
        if (!products.length) {
          infiniteScroll.enable(false);
        }
        this.products = this.products.concat(products);
      }, err => {
        infiniteScroll.complete();
        this.functionsService.presentToast(err.message);
      });

  }

  //search Page
  search() {
    this.navCtrl.push('SearchPage');
  }

  //product details
  detail(product: Product) {
    this.navCtrl.push('ProductDetailPage', {
      product: product
    })
  }

  //favourites page
  favourites() {
    this.navCtrl.push('FavouritesPage');
  }

  //cart Page
  cart() {
    this.functionsService.openCart();
  }

  //favourites
  addFavourite(product: Product, index: number) {
    this.products[index].favourite = true;
    this.favouriteService.getFavourites()
      .then((products: Product[]) => {
        if (products) {
          products.push(product);
        } else {
          products = []
          products.push(product);
        }

        this.favouriteService.addFavourites(products);

      });
  }


  removeFavourite(product: Product, index: number) {
    this.products[index].favourite = false;
    this.favouriteService.getFavourites()
      .then((products: Product[]) => {
        if (products) {
          let i = products.indexOf(product);
          products.splice(i, 1);

          this.favouriteService.addFavourites(products)
        }
      });
  }

  //watch favourites
  watchFavourites() {
    this.favoritesSubscription = this.favouriteService.watchFavourites()
      .subscribe(favouritesNo => {
        this.favouritesNo = favouritesNo;
      })
  }

  //watch Cart
  watchCart() {
    this.cartSubscription = this.cartService.watchCart()
      .subscribe(cartNo => {
        this.cartNo = cartNo;
      })
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  enableFilter() {
    this.showFilter = false;
    this.skip = 0;
    this.getProducts();
  }

  //refresher
  doRefresh(refresher) {
    this.skip = 0;
    this.getProducts(refresher);
  }
}
