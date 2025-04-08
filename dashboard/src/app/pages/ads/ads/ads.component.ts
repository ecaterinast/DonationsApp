import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ad } from '../../../../shared/ad';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';

@Component({
  selector: 'ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  ads: Ad[];
  loading: boolean;

  constructor(public dataService: DataService, private functionsService: FunctionsService,
    private translateService: TranslateService , private router : Router) {

  }

  ngOnInit() {
    this.getAds();
  }

  getAds() {
    this.dataService.getData('ads?filter=' + JSON.stringify({include : ['category','product','brand']}))
      .subscribe((ads: Ad[]) => {
        this.ads = ads;
      }, err => {
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  

  delete(ad: Ad) {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.loading = true;
      this.dataService.deleteData('ads/' + ad.id)
        .subscribe(res => {
          this.dataService.deleteData('ads/' + ad.id)
            .subscribe(res => {
              this.getAds();
              this.dataService.deleteData('containers/images/files/' + ad.imageURL).subscribe();
              this.loading = false;
              this.functionsService.showToast('success', this.translateService.instant('MESSAGES.deleted'), '');

            }, err => {
              this.loading = false;
              this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
            })

        }, err => {
          this.loading = false;
          this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
        })

    }
  }



  edit(ad : Ad) : void {
    this.router.navigateByUrl('pages/ads/edit/' + ad.id);
  
  }

  add() : void {
    this.router.navigateByUrl('pages/ads/add')
  }


}
