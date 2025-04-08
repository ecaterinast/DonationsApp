import { Location } from '@angular/common';
import { Product } from './../../../../shared/product';
import { Category } from './../../../../shared/category';
import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Variable } from '../../../../shared/variable';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Stock } from '../../../../shared/stock';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Brand } from '../../../../shared/brand';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  file: any;
  loading: boolean = false;
  categories: Category[];
  subCategories: any[];
  product: Product;
  variables: Variable[];
  detailsForm: FormGroup;
  descriptionForm: FormGroup;
  productVariables: Variable[] = [];
  stocks: Stock[];
  stock: number = 0;
  brands: Brand[];
  gallery: any[] = [];
  galleryFiles: File[] = [];
  deleteGallery: string[] = [];




  constructor(private fb: FormBuilder, public dataService: DataService,
    private functionsService: FunctionsService, private location: Location,
    private translateService: TranslateService, private route: ActivatedRoute) {
    this.createForm();

  }

  ngOnInit() {
    this.getProduct();
    this.getVariables();
  }


  getProduct() {
    this.loading = true;
    let id = this.route.snapshot.params.id;
    this.dataService.getData(`products/${id}?filter=${JSON.stringify({ include: ['stocks'] })}`)
      .subscribe((product: Product) => {
        this.getBrands();
        this.getCategories();
        this.product = product;
        this.productVariables = product.variables;
        this.stocks = product.stocks;
        this.stock = product.stock;

        this.detailsForm.patchValue({
          name: product.name,
          price: product.price,
          discount: product.discount,
          available: product.available,
          featured: product.featured
        });

        this.descriptionForm.patchValue({
          description: this.product.description,
        });

        this.getStock();
      })
  }

  getVariables() {
    this.dataService.getData('variables')
      .subscribe((variables: Variable[]) => {
        this.variables = variables;
      })
  }


  getCategories() {
    this.dataService.getData(`categories?filter=${JSON.stringify({ include: 'subcategories' })}`)
      .subscribe((categories: Category[]) => {
        let category = categories.filter(cat => { return cat.id == this.product.categoryId })[0];
        this.categories = categories;
        this.subCategories = category.subcategories;
        setTimeout(() => {
          this.detailsForm.patchValue({
            'categoryId': this.product.categoryId,
            'subcategoryId': this.product.subcategoryId
          });
        });

        this.loading = false;
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  getBrands() {
    this.dataService.getData('brands')
      .subscribe((brands: Brand[]) => {
        this.brands = brands;
        setTimeout(() => {
          this.detailsForm.patchValue({
            'brandId': this.product.brandId
          });
        });
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
      discount: '',
      available: false,
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

    if (this.file || this.galleryFiles.length) {
      // handle requests
      let requests = [];
      if (this.file) requests.push(this.dataService.upload(this.file));
      requests = requests.concat(
        this.galleryFiles.map(f => {
          return this.dataService.upload(f);
        })
      );

      forkJoin(requests)
        .subscribe((res: any[]) => {
          // handle result
          let image = this.product.image;
          if (this.file) {
            image = res[0].result.files.file[0].name;
            res.splice(0, 1);
          }


          let gallery = this.product.gallery;
          if (res.length) {
            for (let i = 0; i < res.length; i++) {
              gallery.push(res[i].result.files.file[0].name)
            }
          }

          this.saveProduct(image, gallery);
        }, err => {
          this.loading = false;
          this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
        });

    } else {
      this.saveProduct(this.product.image, this.product.gallery);
    }


  }

  saveProduct(imageURL: string, gallery: string[]) {
    let product = {
      gallery,
      image: imageURL,
      id: this.product.id,
      variables: this.productVariables,
      ...this.detailsForm.value,
      ...this.descriptionForm.value
    }
    this.dataService.updateData(`products`, product)
      .subscribe(res => {
        //update stock
        this.saveStock();
        //delete images if updated
        if (this.file) {
          this.dataService.deleteData('containers/images/files/' + this.product.image).subscribe();
        }
        if (this.deleteGallery) {
          this.deleteGallery.forEach(file => {
            this.dataService.deleteData('containers/images/files/' + file).subscribe();
          })
        }
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }


  back() {
    this.location.back();
  }



  //save product stock
  saveStock() {

    if (this.stocks.length == 0) {
      this.loading = false;
      this.functionsService.showToast('success', this.translateService.instant('MESSAGES.saved'), '');
      return this.back();
    }

    this.stocks.forEach(stock => {
      if (stock.name == 'all') {
        stock.stock = this.stock;
      }
      else {
        this.productVariables.forEach(variable => {
          variable.values.forEach(value => {
            if (value.name == stock.name) {
              stock.stock = value.stock;
            }
          })
        })
      }
    });

    let requests: Observable<any>[] = [];

    this.stocks.forEach(stock => {
      requests.push(
        this.dataService.updateData('stocks', stock)
      );
    })


    forkJoin(requests).subscribe(res => {
      this.loading = false;
      this.back();
      this.functionsService.showToast('success', this.translateService.instant('MESSAGES.saved'), '');
    }, err => {
      this.loading = false;
      this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
    })
  }

  //assign each stock for each value
  getStock() {
    this.stocks.forEach(stock => {
      this.productVariables.forEach(variable => {
        variable.values.forEach(value => {
          if (value.name == stock.name) {
            value.stock = stock.stock
          }
        });
      })
    });
  }

  deleteProductImage(index: number) {
    this.deleteGallery.push(this.product.gallery[index]);
    this.product.gallery.splice(index, 1);
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