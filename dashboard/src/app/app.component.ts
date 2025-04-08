import { Router, RouterEvent } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { DataService } from './services/data/data.service';
import { FunctionsService } from './services/functions/functions.service';


@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private router : Router , private translateService : TranslateService , 
    private layoutService : NbLayoutDirectionService ,  private dataService : DataService , 
    private functionsService : FunctionsService ) {
    
  }

  ngOnInit() {
    this.showFirstPage();
    this.checkLang();
  }

  checkLang() {
    let lang = localStorage.getItem('lang');
    if (lang) {
      this.translateService.use(lang);
      if (lang == 'ar') this.layoutService.setDirection(NbLayoutDirection.RTL);
    } else {
      this.translateService.use('en');

    }
  }

  showFirstPage() {
    this.router.events.pipe(take(1)).subscribe((event : RouterEvent) => {        
      let accessToken = localStorage.getItem('access_token');
      let url = event.url;
      if (accessToken) {
        this.router.navigateByUrl(url == '/' ? '/pages/dashboard' : url);
      } 
      else if (url.includes('policy')) {
        this.router.navigateByUrl(url);
      }
      else {
        this.router.navigateByUrl('/login')
      }
      
    })
  }



  //logout user
  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
  }


  



}
