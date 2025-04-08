import { FunctionsService } from './../../services/functions/functions.service';
import { DataService } from './../../services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form : FormGroup;
  loading : boolean = false;
  user : string;


  constructor(private fb : FormBuilder , private dataService : DataService , 
    private functionsService : FunctionsService , private router : Router , 
    private route : ActivatedRoute , private translateService : TranslateService) { 
    this.createForm();
  }

  ngOnInit() {
    this.user = this.route.snapshot.params.user;
  }


  createForm() {
    this.form = this.fb.group({
      email : ['' ,[ Validators.required , Validators.email]],
      password : ['' , Validators.required]
    })
  }


  login(){
    this.loading = true;
    let form = this.form.value;
    this.dataService.login(form)
      .then((res : any) => {
        this.loading = false;
        localStorage.setItem('access_token' , res.id);
        this.router.navigateByUrl('/pages/dashboard');   
      })
      .catch(err => {
        this.loading = false;
        if (err.status == 401) {
          return this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.incorrectCredentials') , '');

        }
        
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
    
  }

}
