import { Location } from '@angular/common';
import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit {

  settings;
  lang : string;
  source: LocalDataSource = new LocalDataSource();
  categoryId : string;

  constructor(private dataService : DataService , private functionsService : FunctionsService , 
    private route : ActivatedRoute , private location : Location , 
    private translateService : TranslateService) {
      this.categoryId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.getSub();
    this.initTableSettings()
    this.translateService.onLangChange.subscribe((event : LangChangeEvent) => {
        this.initTableSettings();
    })
  }


 


  initTableSettings(): void {
   this.settings  = {
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
      }
      
    },
    noDataMessage: this.translateService.instant('FORM.noData')
  }

}



  getSub() {
    this.dataService.getData(`categories/${this.categoryId}/subcategories`)
      .subscribe((categories : any[]) => {
        this.source.load(categories);
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

  onDeleteConfirm(event): void {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.dataService.deleteData('subcategories/'+event.data.id)
        .subscribe(res => {
          this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.deleted') , '');
          event.confirm.resolve();
        } , err => {
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
          event.confirm.reject();
        })
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event) : void {
    this.dataService.updateData('subcategories/' + event.data.id , event.newData)
      .subscribe(res => {
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
        event.confirm.resolve();
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        event.confirm.reject();
      })
  }


  onCreateConfirm(event) : void {
    this.dataService.postData(`categories/${this.categoryId}/subcategories` , event.newData)
      .subscribe(res => {
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
        event.confirm.resolve();
        this.getSub();

      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        event.confirm.reject();
      })
  }


  back() {
    this.location.back();
  }

}
