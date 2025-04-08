import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';
import { TranslationProvider } from '../../providers/translation/translation';
import { Brand } from '../../shared/brand';


@IonicPage()
@Component({
  selector: 'page-brands',
  templateUrl: 'brands.html',
})
export class BrandsPage {


  loading: boolean;
  brands: Brand[];
  direction: string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataProvider,
    private translationService: TranslationProvider,
    private functionsService: FunctionsProvider
  ) {
  }


  ionViewWillEnter() {
    this.direction = this.translationService.getDirection();
  }


  ionViewDidLoad() {
    this.getData();
  }

  getData(ev?: any) {
    if (!ev) this.loading = true;
    this.dataService.getBrands()
      .subscribe((res: Brand[]) => {
        ev ? ev.complete() : this.loading = false;
        this.brands = res;
      }, e => {
        ev ? ev.complete() : this.loading = false;
        this.functionsService.presentToast(
          this.translationService.translate('MESSAGES.error')
        );
      })
  }


  openBrand(brand : Brand) {
    this.navCtrl.push('BrandDetailPage', {
      brandId : brand.id
    });
  }

}
