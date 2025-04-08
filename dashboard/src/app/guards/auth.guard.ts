import { FunctionsService } from './../services/functions/functions.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private functionsService : FunctionsService , private router : Router , 
    private translateService : TranslateService , private dataService : DataService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : boolean | Promise<any> {
      
      return this.dataService.isAuthenticated().then(authenticated => {
        if (authenticated) {
          return true;
        } else {
          this.router.navigateByUrl('login');
          setTimeout( () => this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.loginAgain'),'') , 1000)
            return false;
        }
      });
      
    
  }
  
}
