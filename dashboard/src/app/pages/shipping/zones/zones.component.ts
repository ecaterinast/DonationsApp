import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Zone } from '../../../../shared/zone';
import { FunctionsService } from '../../../services/functions/functions.service';
import { DataService } from '../../../services/data/data.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {


  settings;

  source: LocalDataSource = new LocalDataSource();


  constructor(private dataService : DataService , private functionsService : FunctionsService , 
    private translateService : TranslateService) {
  
  }

  ngOnInit() {
    this.getZones();
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
        },
        cost: {
          title: this.translateService.instant('FORM.cost'),
          type: 'string',
        }
      },
      noDataMessage: this.translateService.instant('FORM.noData'),

    }
  }



  getZones() {
    this.dataService.getData(`shippings`)
      .subscribe((zones : Zone[]) => {
        this.source.load(zones);
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

  onDeleteConfirm(event): void {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.dataService.deleteData('shippings/'+event.data.id)
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
    this.dataService.updateData('shippings/' + event.data.id , event.newData)
      .subscribe(res => {
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
        event.confirm.resolve();
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        event.confirm.reject();
      })
  }


  onCreateConfirm(event) : void {
    this.dataService.postData(`shippings/` , event.newData)
      .subscribe(res => {
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
        event.confirm.resolve();
        this.getZones();
      } , err => {
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        event.confirm.reject();
      })
  }


}
