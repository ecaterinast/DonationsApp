import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, InfiniteScroll } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';
import { Product } from '../../shared/product'
import { TranslationProvider } from '../../providers/translation/translation';
import { LangChangeEvent } from '@ngx-translate/core';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild('searchBar') searchBar: Searchbar;

  products: Product[];
  loading: boolean = false;
  direction: string;
  searchText: string;
  skip: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private functionsService: FunctionsProvider, public dataService: DataProvider,
    private translationService: TranslationProvider) {
    setTimeout(() => this.searchBar.setFocus(), 500)
  }

  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
    this.watchLang();
  }


  //search handling
  onInput(ev) {
    this.searchText = ev.target.value;
  }

  search() {
    if (!this.searchText || this.searchText.trim() == '') return;
    this.loading = true;
    this.dataService.search(this.skip, this.searchText)
      .subscribe((products: Product[]) => {
        this.loading = false;
        this.products =  products 
      }, err => {
        this.loading = false;
        let msg = this.translationService.translate('MESSAGES.error');
        this.functionsService.presentToast(msg);
      })
  }


  //track function
  trackByFn(product) {
    return product.id;
  }

  // for infinite scroll
  getMore(infiniteScroll: InfiniteScroll) {
    this.skip += 20;
    this.dataService.search(this.skip, this.searchText)
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

  //product detail
  detail(product) {
    this.navCtrl.push('ProductDetailPage', {
      product: product
    })
  }


  //watch lang change
  watchLang() {
    this.translationService.translateService.onLangChange
      .subscribe((ev: LangChangeEvent) => {
        this.direction = this.translationService.getDirection();
      })
  }



}
