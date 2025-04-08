import { Category } from './../../../../shared/category';
import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { NbDialogService } from '@nebular/theme';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories : Category[];
  loading : boolean;

  constructor(public dataService : DataService , private functionsService : FunctionsService , 
    private dialogService: NbDialogService , private translateService : TranslateService) {
  
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.dataService.getData('categories')
      .subscribe((categories : Category[]) => {
        this.categories = categories;
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

  addCategory() {
    let dialogRef = this.dialogService.open(AddCategoryComponent);
    dialogRef.onClose.subscribe(() => this.getCategories());
  }

  delete(category : Category) {
    if (window.confirm(this.translateService.instant('MESSAGES.categoryConfirmDelete'))) {
      this.loading = true;
      let requests = [
        this.dataService.deleteData('categories/'+category.id + '/products'),
        this.dataService.deleteData('categories/'+category.id + '/subcategories'),
      ];

      forkJoin(requests)
        .subscribe(res => {
          this.dataService.deleteData('categories/'+category.id)
            .subscribe(res => {
              this.getCategories();
              this.dataService.deleteData('containers/images/files/' + category.image).subscribe();
              this.loading = false;
              this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.deleted') , '');

            } , err => {
              this.loading = false;
              this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
            })

        } , err => {
          this.loading = false;
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        })
     
    } 
  }

  edit(category : Category) {
    this.dataService.navParams.category = category;
    let dialogRef = this.dialogService.open(EditCategoryComponent );
    dialogRef.onClose.subscribe(res => {
      this.getCategories();
      this.dataService.navParams = {};
    })
  }


}
