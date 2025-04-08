import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../../../services/functions/functions.service';
import { DataService } from '../../../services/data/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  loading : boolean;
  title : string = '';
  body : string = '';

  constructor(private functionsService : FunctionsService , private dataService : DataService ,
    private translateService : TranslateService) { }

  ngOnInit() {
  }

  publish() {
    if ( this.title.length == 0 || this.body.length == 0) {
      return  this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.required') , '');
    }
    this.loading = true;
    let fcm = {
      to : 'mtgrk-all' , title : this.title , body : this.body 
    }

    this.dataService.postData('notifications/send' , fcm)
      .subscribe(res => {
        this.loading = false;
        this.title = '';
        this.body = '';
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.published') , '');
      } , err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })

  } 

}
