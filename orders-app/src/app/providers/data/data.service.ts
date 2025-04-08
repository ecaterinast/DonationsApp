import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MARKET } from 'src/shared/config';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public baseURL : string = MARKET.baseURL;
  public controlPanel : string =  MARKET.controlPanel;
 

  constructor(private httpClient : HttpClient ) { }

  getData(endPoint : string) {
    return this.httpClient.get(this.baseURL + endPoint);
  }


  postData(endPoint : string , body : any) {
    return this.httpClient.post(this.baseURL + endPoint , body);
  }

  updateData(endPoint : string , body : any) {
    return this.httpClient.put(this.baseURL + endPoint , body);
  }


  //login
  login(cred) {
    let promise =new Promise((resolve , reject) => {
      this.httpClient.post(this.baseURL + 'users/login' , cred)
        .subscribe((res : any) => {
          this.httpClient.get(this.baseURL + `RoleMappings?filter=${JSON.stringify({include : 'role'})}`)
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
