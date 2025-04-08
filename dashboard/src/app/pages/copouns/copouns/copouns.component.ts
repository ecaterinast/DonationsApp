import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
import { Copoun } from '../../../../shared/copoun';
import { DatePipe } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CopounModifyComponent } from '../copoun-modify/copoun-modify.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'copouns',
  templateUrl: './copouns.component.html',
  styleUrls: ['./copouns.component.scss']
})
export class CopounsComponent implements OnInit {

  settings;

  source: LocalDataSource = new LocalDataSource();


  constructor(private dataService : DataService , private functionsService : FunctionsService ,
    private datePipe : DatePipe , private translateService : TranslateService , 
    private dialog : NbDialogService) {
  
  }

  ngOnInit() {
    this.getcopouns();
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
        code: {
          title: this.translateService.instant('FORM.code'),
          type: 'string',
        },
        discount: {
          title: this.translateService.instant('FORM.discount'),
          type: 'number',
        },
        validUntil: {
          title: this.translateService.instant('FORM.validUntil'),
          type : 'html',
          valuePrepareFunction : value => {return this.datePipe.transform(value, 'dd/M/yyyy')}
        },
        
      },
      noDataMessage: this.translateService.instant('FORM.noData'),
      mode : 'external'
    }

  }



  getcopouns() {
    this.dataService.getData(`copouns`)
      .subscribe((copouns : Copoun[]) => {
        this.source.load(copouns);
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

  onDeleteConfirm(event): void {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.dataService.deleteData('copouns/'+event.data.id)
        .subscribe(res => {
          this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
          this.getcopouns();
        } , err => {
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
          event.confirm.reject();
        })
    } else {
      event.confirm.reject();
    }
  }

 


  edit(event) : void {
    this.dataService.navParams.copoun = event.data;
    let dialogRef = this.dialog.open(CopounModifyComponent);
    dialogRef.onClose.subscribe(() => this.getcopouns());
  
  }


  add(event) : void {
   let dialogRef = this.dialog.open(CopounModifyComponent);
   dialogRef.onClose.subscribe(() => {
     this.getcopouns();
     this.dataService.navParams = {};
    })

  }


}
