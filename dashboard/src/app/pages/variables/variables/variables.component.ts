import { Component, OnInit } from '@angular/core';
import { Variable } from '../../../../shared/variable';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})
export class VariablesComponent implements OnInit {
  
  settings;
  source: LocalDataSource = new LocalDataSource();

 
  constructor(private functionsService : FunctionsService, private dataService : DataService , 
    private translateService : TranslateService , private router : Router) { }


  ngOnInit() {
    this.getVariables();
    this.initTableSettings()
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
        key: {
          title: this.translateService.instant('FORM.name'),
          type: 'string',
        }
      },
      noDataMessage: this.translateService.instant('FORM.noData'),
      mode : 'external'
    }

  }

  getVariables() {
    this.dataService.getData('variables')
      .subscribe((variables : Variable[]) =>{
        this.source.load(variables)
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');

      })
  }

  edit(event) {
    let variable = event.data;
    this.dataService.navParams.variable = variable;
    this.router.navigateByUrl('/pages/variables/modify');
  
  }


  add(event) : void {
    this.router.navigateByUrl('/pages/variables/modify');
  }

 

  onDeleteConfirm(event): void {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.dataService.deleteData('variables/' + event.data.id)
      .subscribe(res => {
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.deleted') , '');
        this.getVariables();
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        event.confirm.reject();
      })
      
    } else {
      event.confirm.reject();
    }
  }


  


}
