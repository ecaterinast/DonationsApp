import { EditComponent } from './../edit/edit.component';
import { AddComponent } from './../add/add.component';
import { Product } from './../../../../shared/product';
import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  settings;


  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService : DataService , private functionsService : FunctionsService , 
    private router : Router , private translateService  : TranslateService) {
  
  }

  ngOnInit() {
    this.getProducts();
    this.initTableSettings();
    this.translateService.onLangChange.subscribe((event : LangChangeEvent) => {
      this.initTableSettings();
    })

  }

  initTableSettings(): void {

    this.settings = {
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmCreate : true
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave : true
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        name: {
          title: this.translateService.instant('FORM.name'),
          type: 'string',
        },
        description: {
          title: this.translateService.instant('FORM.desc'),
          type: 'string',
        }
      },
      mode : 'external',
      noDataMessage: this.translateService.instant('FORM.noData'),
    }
   

}



  getProducts() {
    this.dataService.getData(`products?filter=${JSON.stringify({include : ['category' , 'subcategory'] , order : 'createdAt DESC'})}`)
      .subscribe((products : Product[]) => {
        this.source.load(products);
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

  onDeleteConfirm(event): void {
    if (window.confirm( this.translateService.instant('MESSAGES.confirmDelete'))) {
      //delete stock
      this.dataService.deleteData('products/'+event.data.id + '/stocks')
      .subscribe(res => {
        //delete product
        this.dataService.deleteData('products/'+event.data.id)
          .subscribe(res => {
            this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.deleted') , '');
            this.dataService.deleteData('containers/images/files/' + event.data.image).subscribe();
            this.getProducts();
          }, err => {
            this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
          })
          

       
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })

        
    } 
  }

  edit(event) : void {
    this.router.navigateByUrl('pages/products/edit/' + event.data.id);
  
  }


  add(event) : void {
    this.router.navigateByUrl('pages/products/add')

  }


}
 