import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FunctionsProvider } from '../../providers/functions/functions';
import { TranslationProvider } from '../../providers/translation/translation';
import { Category } from '../../shared/category';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  loading: boolean;
  categories: Category[];
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
    this.dataService.getCategories()
      .subscribe((res: Category[]) => {
        ev ? ev.complete() : this.loading = false;
        this.categories = res;
      }, e => {
        ev ? ev.complete() : this.loading = false;
        this.functionsService.presentToast(
          this.translationService.translate('MESSAGES.error')
        );
      })
  }


  openCategory(catId: string) {
    this.navCtrl.push('CategoryDetailPage', {
      catId
    });
  }

}
