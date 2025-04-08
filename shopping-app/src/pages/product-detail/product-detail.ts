import { SocialSharing } from '@ionic-native/social-sharing';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../shared/product';
import { Rating } from '../../shared/rating';
import { DataProvider } from '../../providers/data/data';
import { FavouritesProvider } from '../../providers/favourites/favourites';
import { FunctionsProvider } from '../../providers/functions/functions';
import { CartProvider } from '../../providers/cart/cart';
import { TranslationProvider } from '../../providers/translation/translation';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderProduct } from '../../shared/order';
import { Subscription } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage implements OnDestroy {

  product: Product;
  products: Product[];
  loading: boolean = false;
  favourites: Product[] = [];
  favourite: boolean = false;
  cartNo: number;
  meanRating: number;
  direction: string;
  selectOptions = {
    mode: 'ios',
  };
  variablesForm: FormGroup;
  formError: boolean;
  cartSubscription: Subscription;
  productRating: number;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: DataProvider, private favouritesService: FavouritesProvider,
    private functionsService: FunctionsProvider, private cartService: CartProvider,
    private socialSharing: SocialSharing, private translationService: TranslationProvider) {

    this.cartNo = this.cartService.products;
    this.getProduct();


  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.getSimilar();
    this.watchCart();
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  //get product
  getProduct() {
    this.product = this.navParams.get('product');
    this.getProductRating();
    this.createForm();
  }

  // get product rating
  getProductRating() {
    if(this.product.ratings) {
      this.productRating = this.calcRating(this.product.ratings);
    } else {
      this.dataService.getRating(this.product.id)
      .subscribe((res : Rating[]) => {
        this.productRating = this.calcRating(res);
      })
    }
  }

  //variables form
  createForm() {
    let variables = this.product.variables;
    if (variables && variables.length != 0) {
      let formGroup: FormGroup = new FormGroup({});
      for (let variable of variables) {
        formGroup.addControl(variable.key, new FormControl('', Validators.required));
      }
      this.variablesForm = formGroup;
    }
  }

  //rating
  calcRating(ratings: Rating[]) {
    if ( ratings.length == 0) return 0;
    let total = 0;
    ratings.forEach(rating => {
      total += rating.rating;
    })
    return (total / ratings.length);
  }


  //products
  getSimilar() {
    this.loading = true;
    this.dataService.getProductsBySubCategory(0, this.product.subcategoryId)
      .subscribe((products: Product[]) => {
        this.favouritesService.getFavourites()
          .then((favourites: Product[]) => {
            if (favourites) {
              this.favourites = favourites;
              this.favourite = this.isFavourite(this.product);
              this.loading = false;
              this.products = products.filter(product => product.id !== this.product.id);
            } else {
              this.loading = false;
              this.favourites = [];
              this.products = products.filter(product => product.id !== this.product.id);
            }
          })

      }, err => {
        this.loading = false;
        let msg = this.translationService.translate('MESSAGES.error')
        this.functionsService.presentToast(msg);
      });

  }

  trackByFun(product: Product) {
    return product.id;
  }

  isFavourite(product: Product) {
    let filter = this.favourites.filter(fav => { return fav.id == product.id });
    if (filter.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  //cart Page
  cart() {
    this.functionsService.openCart();
  }

  //favourites
  addFavourite(product: Product, index?: number) {
    if (index) {
      //this means from similar products
      this.products[index].favourite = true;
    } else {
      //this means it is the primary product
      this.favourite = true;
    }
    this.favouritesService.getFavourites()
      .then((products: Product[]) => {
        if (products) {
          products.push(product);
        } else {
          products = []
          products.push(product);
        }

        this.favouritesService.addFavourites(products);

      });
  }


  removeFavourite(product: Product, index?: number) {
    if (index) {
      //this means from similar products
      this.products[index].favourite = false;
    } else {
      //this means it is the primary product
      this.favourite = false;
    }
    this.favouritesService.getFavourites()
      .then((products: Product[]) => {
        if (products) {
          let i = products.indexOf(product);
          products.splice(i, 1);

          this.favouritesService.addFavourites(products)
        }
      });
  }


  //show more products
  viewMore() {
    this.navCtrl.push('SimilarPage', {
      subcategoryId: this.product.subcategoryId
    })
  }

  addToCart() {

    if (this.variablesForm) {
      if (!this.variablesForm.valid) {
        return this.formError = true;
      }
      this.formError = false;
      this.product.orderedVariables = this.variablesForm.value;
    }

    this.cartService.getProducts()
      .then((products: OrderProduct[]) => {
        if (products) {
          let filter = products.filter(product => { return product.id == this.product.id })[0];

          if (filter != undefined) {
            products.forEach(product => {
              if (product.id == this.product.id) {

                //check if there is ordered variables in product
                if (this.product.orderedVariables) {
                  let sameOrder: boolean = true;
                  for (let variable of this.product.variables) {
                    let key = variable.key;
                    if (product.orderedVariables[key].en != this.product.orderedVariables[key].en) {
                      sameOrder = false;
                      break;
                    }
                  }

                  //check if it is the same increase amount else add new one with new variables              
                  if (sameOrder) {
                    product.amount += 1;
                  } else {
                    let product: OrderProduct = {
                      id: this.product.id,
                      amount: 1,
                      orderedVariables: this.product.orderedVariables
                    }
                    products.push(product);
                  }
                } else {
                  //no ordered variables so we increase the amount
                  product.amount += 1;
                }
              }
            });

          } else {
            let product: OrderProduct = {
              id: this.product.id,
              amount: 1,
              orderedVariables: this.product.orderedVariables ? this.product.orderedVariables : undefined
            }
            products.push(product);
          }
        } else {
          let product: OrderProduct = {
            id: this.product.id,
            amount: 1,
            orderedVariables: this.product.orderedVariables ? this.product.orderedVariables : undefined
          }
          products = [product];
        }
        this.cartService.addProducts(products).then(_ => {
          let msg = this.translationService.translate('MESSAGES.productAdded');
          this.functionsService.presentToast(msg)
        })
      })
  }

  //watch Cart
  watchCart() {
    this.cartSubscription = this.cartService.watchCart()
      .subscribe(cartNo => {
        this.cartNo = cartNo;
      })
  }

  //open rating page
  rating() {
    this.navCtrl.push('RatingPage', {
      id: this.product.id
    })
  }

  //product details
  detail(product: Product) {
    this.navCtrl.push('ProductDetailPage', {
      product: product
    })
  }

  //share product
  share() {
    let url = this.dataService.baseURL + 'containers/images/download/' + this.product.image;
    let product = {
      description: this.product.description,
      name: this.product.name
    }
    this.socialSharing.share(product.description, product.name, url)
      .then(() => console.log('succss'))
      .catch(err => alert(JSON.stringify(err)));
  }

  shareVia(type: string) {
    let url = this.dataService.baseURL + 'containers/images/download/' + this.product.image;
    let product = {
      description: this.product.description,
      name: this.product.name
    }
    let message = `${product.name} : ${product.description}`;
    if (type == 'facebook') {

      this.socialSharing.canShareVia(type).then((value) => {
        this.socialSharing.shareViaFacebook(message, url)
          .then(() => console.log('success'))
          .catch(err => alert(JSON.stringify(err)));
      })
        .catch(() => {
          let msg = this.translationService.translate('MESSAGES.facebook');
          this.functionsService.presentToast(msg);
        });

    }
    else if (type == 'whatsapp') {
      this.socialSharing.canShareVia(type).then((value) => {
        this.socialSharing.shareViaWhatsApp(message, url)
          .then(() => console.log('success'))
          .catch(err => alert(JSON.stringify(err)));
      })
        .catch(() => {
          let msg = this.translationService.translate('MESSAGES.whatsapp');
          this.functionsService.presentToast(msg);
        });
    }
    else if (type == 'twitter') {
      this.socialSharing.canShareVia(type).then((value) => {
        this.socialSharing.shareViaTwitter(message, url)
          .then(() => console.log('success'))
          .catch(err => alert(JSON.stringify(err)));
      })
        .catch(() => {
          let msg = this.translationService.translate('MESSAGES.twitter');
          this.functionsService.presentToast(msg);
        });

    }
    else if (type == 'instagram') {
      this.socialSharing.canShareVia(type).then((value) => {
        this.socialSharing.shareViaInstagram(message, url)
          .then(() => console.log('success'))
          .catch(err => alert(JSON.stringify(err)));
      })
        .catch(() => {
          let msg = this.translationService.translate('MESSAGES.instagram');
          this.functionsService.presentToast(msg);
        });
    }

  }

}
