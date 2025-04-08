import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { Customer } from './../../../../shared/customer';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers : Customer[];

  name : string;

  phone : string;

  settings 

  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService : DataService , private functionsService : FunctionsService , 
    private router : Router , private translateService : TranslateService) {
  }

  ngOnInit() {
    this.initTableSettings();
    this.getCustomers();
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
        phone: {
          title: this.translateService.instant('FORM.phone'),
          type: 'string',
        }
      },
      mode : 'external',
      noDataMessage: this.translateService.instant('FORM.noData'),

    };
}

  getCustomers() {
    this.dataService.getData(`customers`)
      .subscribe((customers : Customer[]) => {
        this.source.load(customers);
        this.customers = customers;
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

  delete(event): void {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.dataService.deleteData('customers/'+event.data.id)
        .subscribe(res => {
          this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.deleted') , '');
          this.getCustomers();
          this.dataService.deleteData('containers/users/files/' + event.data.image).subscribe();
        } , err => {
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        })
    }
  }

  

  edit(event) : void {
    this.dataService.navParams = event.data;
    this.router.navigateByUrl('pages/customers/edit')
  
  }


  add(event) : void {
    this.router.navigateByUrl('pages/customers/add')

  }


  
}
