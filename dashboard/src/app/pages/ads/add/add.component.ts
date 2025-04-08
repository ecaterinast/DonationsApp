import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { Ad } from '../../../../shared/ad';
import { Brand } from '../../../../shared/brand';
import { Category } from '../../../../shared/category';
import { Product } from '../../../../shared/product';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  file: File;
  loading: boolean;
  searchText = '';
  products: Product[];
  product: Product;
  brands: Brand[];
  categories: Category[];
  brandId: string;
  categoryId: string;

  constructor(
    private location: Location,
    public dataService: DataService,
    private translateService: TranslateService,
    private functionsService: FunctionsService
  ) { }

  ngOnInit() {
    this.getData();
  }

  back() {
    this.location.back();
  }

  onImageSelected(ev) {
    this.file = ev.target.files[0];
  }

  searchForProduct() {
    if (this.searchText.trim() == '') return;
    this.loading = true
    this.dataService.getData('products?filter=' + JSON.stringify({  where: { name: { regexp: `/${this.searchText}/i` }, available: true }, order: "createdAt DESC", limit: 5 }))
      .subscribe((products: Product[]) => {
        this.loading = false;
        this.product = products[0]
        this.products = products;
      }, e => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  chooseProduct(prod: Product) {
    this.product = prod;
  }

  getData() {
    this.loading = true;
    forkJoin([
      this.dataService.getData('brands'),
      this.dataService.getData(`categories`)
    ])
      .subscribe((res: any[]) => {
        this.loading = false;
        this.brands = res[0];
        this.categories = res[1];
      }, err => {
        this.loading = false;
        this.back();
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      });
  }


  save() {
    if (!this.product && !this.brandId && !this.categoryId) return;

    this.loading = true;
    this.dataService.upload(this.file)
      .subscribe((upload: any) => {
        this.saveAd(upload.result.files.file[0].name)
      }, e => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      });
  }

  saveAd(imageURL: string) {
    let ad: Ad = {
      imageURL
    }

    if (this.product) ad.productId = this.product.id;
    if (this.categoryId) ad.categoryId = this.categoryId;
    if (this.brandId) ad.brandId = this.brandId;

    this.dataService.postData('ads', ad)
      .subscribe(res => {
        this.loading = false;
        this.back();
        this.functionsService.showToast('success', this.translateService.instant('MESSAGES.saved'), '');
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

}
