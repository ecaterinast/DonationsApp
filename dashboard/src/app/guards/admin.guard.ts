import { FunctionsService } from './../services/functions/functions.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor (private functionsService : FunctionsService , private router : Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean  {
  
      let token = localStorage.getItem('access_token');
      if (token) {
        return true;
      } else {
       
       this.router.navigateByUrl('/login/admin');
       setTimeout( () => this.functionsService.showToast('danger' , 'Log in' , 'please , login before') , 1000)
        return false;
      }
  }
  
}
