import { MARKET } from './../../shared/config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../shared/product';
import { Category } from '../../shared/category';
import { DataProvider } from '../../providers/data/data';
import { CartProvider } from '../../providers/cart/cart'
import { FunctionsProvider } from '../../providers/functions/functions';
import { FavouritesProvider } from '../../providers/favourites/favourites';
import { Rating } from '../../shared/rating';
import { TranslationProvider } from '../../providers/translation/translation';
import { LangChangeEvent } from '@ngx-translate/core';
import { Slider } from '../../shared/slider';
import { Banner } from '../../shared/banner';
import { HomeCategory } from '../../shared/homeCategory';
import { Ad } from '../../shared/ad';
import { Subscription } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit, OnDestroy {

  categories: Category[];
  favourits: Product[];
  favouritesNo: number;
  cartNo: number;
  market = MARKET;
  direction: string;
  sliders: Slider[];
  banners: Banner[];
  homeCategories: HomeCategory[];
  loading: boolean = false;
  refresher: boolean = false;
  featuredProducts: Product[];
  favoritesSubscription: Subscription;
  cartSubscription: Subscription;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: DataProvider, private functionsService: FunctionsProvider,
    private favouriteService: FavouritesProvider, private cartService: CartProvider,
    private translationService: TranslationProvider, private modalCtrl: ModalController) {

    this.favouritesNo = this.favouriteService.favourites;
    this.cartNo = this.cartService.products;
  }

  async ngOnInit() {
    await this.getFavourites();
    this.getHomeDesign();
    this.watchFavourites();
    this.watchCart();
    this.watchLang();
  }

  ngOnDestroy() {
    this.favoritesSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
  }


  //categories
  getCategories() {
    this.dataService.getCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });
  }

  //home design
  getHomeDesign(refresher?: any) {
    this.getCategories();
    this.getSliders();
    this.getBanners();
    this.getFeaturedProducts();
    this.getHomeCategories(refresher);
    this.showAd();

  }


  getFeaturedProducts() {
    this.dataService.getFeaturedProducts()
      .subscribe((res: Product[]) => {
        this.featuredProducts = res;
      });
  }


  getBanners() {
    this.dataService.getBanners()
      .subscribe((banners: Banner[]) => {
        this.banners = banners;
      });
  }

  getHomeCategories(refresher?: any) {
    this.loading = true;
    this.dataService.getHomeCategories()
      .subscribe((categories: HomeCategory[]) => {
        categories.forEach(category => {
          category.products = [];
          this.dataService.getProductsByCategory(0, category.categoryId)
            .subscribe((products: Product[]) => {
              category.products = products;
            });
        });
        this.homeCategories = categories;
        if (refresher) refresher.complete();
        this.loading = false;

      }, err => {
        this.loading = false;
        if (refresher) refresher.complete()
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      });
  }


  getSliders() {
    this.dataService.getSliders()
      .subscribe((sliders: Slider[]) => {
        this.sliders = sliders;
      });
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

  //favourite section
  getFavourites(): Promise<boolean> {
    var pomise = new Promise<boolean>((resolve, reject) => {
      this.favouriteService.getFavourites()
        .then((favourites: Product[]) => {
          if (favourites) {
            this.favourits = favourites;
            this.favouritesNo = favourites.length;
          }
          resolve(true)
        })
    });

    return pomise;
  }

  isFavourite(product: Product) {
    if (this.favourits != undefined) {
      let filter = this.favourits.filter(fav => { return fav.id == product.id });
      if (filter.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }



  addFavourite(product: Product) {
    product.favourite = true;
    this.favouritesNo += 1;
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


  removeFavourite(product: Product) {
    product.favourite = false;
    this.favouritesNo -= 1;
    this.favouriteService.getFavourites()
      .then((products: Product[]) => {
        if (products) {
          let i = products.indexOf(product);
          products.splice(i, 1);

          this.favouriteService.addFavourites(products)
        }
      });
  }

  //favourites page
  favourites() {
    this.navCtrl.push('FavouritesPage');
  }

  //cart Page
  cart() {
    this.functionsService.openCart();
  }


  //open category detail page
  openCategory(catId: string) {
    this.navCtrl.push('CategoryDetailPage', {
      catId
    });
  }

  //product details
  detail(product: Product) {
    this.navCtrl.push('ProductDetailPage', {
      product: product
    })
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

  //watch lang change
  watchLang() {
    this.translationService.translateService.onLangChange
      .subscribe((ev: LangChangeEvent) => {
        this.direction = this.translationService.getDirection();
      })
  }


  //refresher

  doRefresh(refresher) {
    this.refresher = true;
    this.getHomeDesign(refresher);
  }


  // Ads
  showAd() {
    if(this.functionsService.showAd) {
      this.dataService.getAds()
      .subscribe((res: Ad[]) => {
        if (res.length) {
          let modal = this.modalCtrl.create('AdPage', { ad: res[0] }, { cssClass: 'adModal' });
          modal.present();
          this.functionsService.showAd = false;
        }
      })
    }

  }

  // slider && banners detail

  adDetail(doc : any) {
    if (doc.product && doc.product != null) {
      this.navCtrl.push('ProductDetailPage', {
        product: doc.product
      })
    }
    else if (doc.categoryId) {
      this.navCtrl.push('CategoryDetailPage', {
        catId: doc.categoryId
      });
    }
    else if (doc.brandId ) {
      this.navCtrl.push('BrandDetailPage', {
        brandId: doc.brandId
      });
    }

  }

  openHome() {
    this.navCtrl.setRoot('HomePage');
  }

  // Chat Page
  openChat() {
    this.navCtrl.setRoot('ChatPage');
  }

// Add Publication Page
  addPublication() {
    this.navCtrl.push('AddPublicationPage');
  }

// Notifications Page
  openNotifications() {
    this.navCtrl.setRoot('NotificationsPage');
  }

// Profile Page
  openProfile() {
    this.navCtrl.setRoot('ProfilePage');
  }
}
