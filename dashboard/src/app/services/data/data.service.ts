import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FunctionsService } from '../functions/functions.service';
import { TranslateService } from '@ngx-translate/core';
import { Config } from '../../../shared/config';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseURL : string = Config.baseURL + '/api/';
  navParams : any= {};

  constructor(private http : HttpClient , private router : Router , private functionsService : FunctionsService , 
    private translateService : TranslateService) {
    
   }

  //data section
  getData(endPoint : string) {
    return this.http.get(this.baseURL + endPoint).pipe(take(1));
  }

  postData(endPoint : string , data : any) {
    let accessToken = localStorage.getItem('access_token');
    return this.http.post(this.baseURL + endPoint + `?access_token=${accessToken}`, data).pipe(
      take(1),
      catchError(err => {      
      if (err.status == 401) {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/login');
      }
      return throwError(err);
    }))
  }

  updateData(endPoint : string , data : any) {
    let accessToken = localStorage.getItem('access_token');
    return this.http.put(this.baseURL + endPoint + `?access_token=${accessToken}`, data).pipe(
      take(1),
      catchError(err => {      
      if (err.status == 401) {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/login');
      }
      return throwError(err);
    }));
  }

  deleteData(endPoint : string) {
    let accessToken = localStorage.getItem('access_token');
    return this.http.delete(this.baseURL + endPoint + `?access_token=${accessToken}`).pipe(
      take(1),
      catchError(err => {      
      if (err.status == 401) {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/login');
      }
      return throwError(err);
    }));
  }

  //upload image
  upload(file : any) {
    let fd  = new FormData();
    fd.append('file' , file);
    return this.http.post(this.baseURL + 'containers/images/upload' , fd).pipe(take(1))
  }

  //check user
  isAuthenticated() {
    let promise = new Promise((resolve , reject) => {
      setTimeout(() => {
        let accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });

    return promise;
  }
  

  //login
  login(cred) {
    let promise =new Promise((resolve , reject) => {
      this.http.post(this.baseURL + 'users/login' , cred)
      .pipe(take(1))
        .subscribe((res : any) => {
          this.http.get(this.baseURL + `RoleMappings?filter=${JSON.stringify({include : 'role'})}`)
            .subscribe((roleMapping : any[]) => {
              let roleMap = roleMapping.filter(mapping => { return mapping.principalId == res.userId})[0];              
              if (roleMap && roleMap.role.name == 'admin') {
                resolve(res);
              } else {
                reject(new Error('not admin'))
              }
            }, err => {
              reject(err)
            })
        } , err => {
          reject(err);
        })
    });
    return promise;
  }

  
 
}
