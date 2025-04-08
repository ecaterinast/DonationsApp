import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
import { Slider } from '../../../../shared/slider';
import { Banner } from '../../../../shared/banner';
import { HomeCategory } from '../../../../shared/homeCategory';
import { Category } from '../../../../shared/category';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {

  sliders: Slider[];
  banners: Banner[];
  homeCategories: HomeCategory[];
  categories: Category[];
  category: Category;
  loading: boolean;


  constructor(public dataService: DataService, private functionsService: FunctionsService,
    private translateService: TranslateService, private router: Router) { }

  ngOnInit() {
    this.getAppConfig();
  }

  getAppConfig() {
    this.getSliders();
    this.getBanners();
    this.getHomeCategories();
    this.getCategories();
  }

  getSliders() {
    this.dataService.getData(`sliders?filter=${JSON.stringify({ include: ['category','product','brand'] })}`)
      .subscribe((sliders: Slider[]) => {
        this.sliders = sliders;
      })
  }


  getBanners() {
    this.dataService.getData(`banners?filter=${JSON.stringify({ include: ['category','product','brand'] })}`)
      .subscribe((banners: Banner[]) => {
        this.banners = banners;
      })
  }


  getHomeCategories() {
    this.dataService.getData(`homeCategories?filter=${JSON.stringify({ include: ['categories'] })}`)
      .subscribe((homeCategories: HomeCategory[]) => {
        if (this.loading) this.loading = false;
        this.homeCategories = homeCategories;
      }, err => {
        if (this.loading) this.loading = false;
      })
  }


  delete(endPoint: string, doc: any) {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.dataService.deleteData(`${endPoint}/${doc.id}`)
        .subscribe(res => {
          if (endPoint == 'sliders') {
            this.dataService.deleteData('containers/images/files/' + doc.imageURL).subscribe();
            this.getSliders();
          }
          if (endPoint == 'banners') {
            this.dataService.deleteData('containers/images/files/' + doc.imageURL).subscribe();
            this.getBanners();
          }
          if (endPoint == 'homeCategories') {
            this.getHomeCategories();
          }
          this.functionsService.showToast('success', this.translateService.instant('MESSAGES.deleted'), '');

        }, err => {
          this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
        })
    }
  }

  modify(endPoint: string, docId?: string) {
    if (docId)
      this.router.navigateByUrl(`pages/mobile/edit/${endPoint}/${docId}`);
    else
      this.router.navigateByUrl(`pages/mobile/add/${endPoint}`)


  }


  getCategories() {
    this.dataService.getData(`categories`)
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        if (this.loading) this.loading = false;
      }, err => {
        if (this.loading) this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  addCategory() {
    this.loading = true;
    this.dataService.postData('/homeCategories', { categoryId: this.category.id })
      .subscribe((res: HomeCategory) => {
        this.category.homeCategoriesId = res.id;
        this.dataService.updateData('categories/' + this.category.id, this.category).subscribe(res => {
          this.getHomeCategories();
          this.functionsService.showToast('success', this.translateService.instant('MESSAGES.saved'), '');
        });
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  deleteCategory(cat) {
    this.loading = true;
    this.dataService.deleteData('homeCategories/' + cat.id)
      .subscribe(res => {
        this.getHomeCategories();
        this.functionsService.showToast('success', this.translateService.instant('MESSAGES.deleted'), '');
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

}
