import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { Product } from '../../shared/product';
import { DataProvider } from '../../providers/data/data';
import { CartProvider } from '../../providers/cart/cart';
import { FunctionsProvider } from '../../providers/functions/functions';
import { FavouritesProvider } from '../../providers/favourites/favourites';
import { Rating } from '../../shared/rating';
import { TranslationProvider } from '../../providers/translation/translation';
import { Subscription } from 'rxjs';





@IonicPage()
@Component({
  selector: 'page-similar',
  templateUrl: 'similar.html',
})
export class SimilarPage implements OnDestroy {

  subcategoryId: string;
  cartNo: number;
  favouritesNo: number;
  skip: number = 0;
  loading: boolean = false;
  favourits: Product[] = [];
  products: Product[];
  showFilter: boolean = false;
  priceOrder: string;
  direction: string;
  favoritesSubscription: Subscription;
  cartSubscription: Subscription;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private cartService: CartProvider, private favouriteService: FavouritesProvider,
    public dataService: DataProvider, private functionsService: FunctionsProvider,
    private translationService: TranslationProvider
  ) {

    this.favouritesNo = this.favouriteService.favourites;
    this.cartNo = this.cartService.products;

  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.subcategoryId = this.navParams.get('subcategoryId');
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

  //products
  getProducts(refresher?: any) {
    if (!refresher) this.loading = true;
    this.dataService.getProductsBySubCategory(this.skip, this.subcategoryId, this.priceOrder)
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

    this.dataService.getProductsBySubCategory(this.skip, this.subcategoryId, this.priceOrder)
      .subscribe((products: Product[]) => {
        infiniteScroll.complete();
        if (products.length == 0) {
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
