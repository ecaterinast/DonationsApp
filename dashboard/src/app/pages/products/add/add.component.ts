import { Location } from '@angular/common';
import { Product } from './../../../../shared/product';
import { Category } from './../../../../shared/category';
import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Variable } from '../../../../shared/variable';
import { TranslateService } from '@ngx-translate/core';
import { Stock } from '../../../../shared/stock';
import { Brand } from '../../../../shared/brand';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  file: any;
  detailsForm: FormGroup;
  descriptionForm: FormGroup;
  loading: boolean = false;
  categories: Category[];
  brands: Brand[];
  subCategories: any[];
  variables: Variable[];
  productVariables: Variable[] = [];
  stock: number;
  gallery: any[] = [];
  galleryFiles: File[] = [];



  constructor(private fb: FormBuilder, private dataService: DataService,
    private functionsService: FunctionsService, private location: Location,
    private translateService: TranslateService) {
  }

  ngOnInit() {
    this.getBrands();
    this.getVariables();
    this.getCategories();
    this.createForm();
  }

  getBrands() {
    this.dataService.getData('brands')
      .subscribe((brands: Brand[]) => {
        this.brands = brands;
      })
  }


  getVariables() {
    this.dataService.getData('variables')
      .subscribe((variables: Variable[]) => {
        this.variables = variables;
      })
  }


  getCategories() {
    this.loading = true;
    this.dataService.getData(`categories?filter=${JSON.stringify({ include: 'subcategories' })}`)
      .subscribe((categories: Category[]) => {
        this.loading = false;
        this.categories = categories;
      }, err => {
        this.loading = false;
        this.back();
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }



  //form
  createForm() {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      subcategoryId: ['', Validators.required],
      brandId: [''],
      price: ['', Validators.required],
      discount: 0,
      featured: false
    });

    this.descriptionForm = this.fb.group({
      description: ['', Validators.required]
    })

    this.detailsForm.get('categoryId').valueChanges.subscribe(id => {
      let category = this.categories.filter(cat => { return cat.id == id })[0];
      this.subCategories = category.subcategories;
    });

  }

  newVariable() {
    let variable: Variable = {
      key: '',
      values: [{ name: '', stock: 0, price: 0 }]
    }
    this.productVariables.push(variable);
  }

  chooseVariable(variable: Variable, i) {
    variable.values.forEach(value => {
      value.price = 0;
      value.stock = 0;
    })
    this.productVariables[i] = variable;
  }

  deleteVariable(i) {
    this.productVariables.splice(i, 1);
  }



  deleteValue(variableIndex, valueIndex) {
    let variable = this.productVariables[variableIndex]
    if (variable.values.length > 1) {
      variable.values.splice(valueIndex, 1);
    } else {
      this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.oneAtLeast'), '')
    }
  }



  onImageSelected(ev) {
    let file = ev.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  onSubmit() {
    //validate variables section
    let err = false;
    for (let i = 0; i < this.productVariables.length; i++) {
      const variable = this.productVariables[i];
      if (variable.key.length == 0) {
        err = true;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.required'), '');
        break;
      }
    }

    if (err) return;


    this.loading = true;

    forkJoin([
      this.dataService.upload(this.file),
      ...this.galleryFiles.map(f => {
        return this.dataService.upload(f);
      })
    ])
      .subscribe((res: any[]) => {
        let gallery = [];
        if(res.length > 1) {
          for(let i = 1;i <res.length;i++) {
            gallery.push(res[i].result.files.file[0].name)
          }
        }
        let product: Product = {
          gallery,
          image: res[0].result.files.file[0].name,
          variables: this.productVariables,
          ...this.detailsForm.value,
          ...this.descriptionForm.value,
        }
        this.dataService.postData(`products`, product)
          .subscribe((product: Product) => {
            this.saveStock(product);
          }, err => {
            this.loading = false;
            this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
          })
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })

  }


  back() {
    this.location.back();
  }

  //save product stock
  saveStock(product: Product) {
    let stocks: Stock[] = [];

    if (this.productVariables.length == 0) {
      //no variables so check for whole product
      if (this.stock) {
        let stock: Stock = {
          productId: product.id,
          name: 'all',
          stock: this.stock
        }
        stocks.push(stock)
      }
    } else {
      this.productVariables.forEach(variable => {
        variable.values.forEach(value => {
          if (value.stock != 0) {
            let stock: Stock = {
              productId: product.id,
              name: value.name,
              stock: value.stock
            }
            stocks.push(stock)
          }
        });
      })
    }
    if (!stocks.length) {
      this.loading = false;
      return this.back();
    }
    this.dataService.postData('stocks', stocks)
      .subscribe(res => {
        this.loading = false;
        this.back();
        this.functionsService.showToast('success', this.translateService.instant('MESSAGES.saved'), '');
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  deleteImage(index: number) {
    this.gallery.splice(index, 1);
    this.galleryFiles.splice(index, 1);
  }

  galleryInputChange(ev) {
    let files = [...ev.target.files];
    if (files.length) {
      this.loading = true;
      files.forEach(file => {
        let reader = new FileReader();
        reader.onload = (ev: any) => {
          this.gallery.push(ev.target.result);
          this.galleryFiles.push(file);
        }
        reader.readAsDataURL(file);
      })

      this.loading = false;
    }

  }

}
