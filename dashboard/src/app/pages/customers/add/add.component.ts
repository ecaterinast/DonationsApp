import { Location } from '@angular/common';
import { Customer } from './../../../../shared/customer';
import { FunctionsService } from './../../../services/functions/functions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Config } from '../../../../shared/config';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent  implements OnInit {

  imageURL : string = 'assets/imgs/avatar.png';
  file : File;
  form : FormGroup
  loading : boolean;
  phone : any;
  userId : string;
  lang : string;

  constructor( private dataService : DataService , private functionsService : FunctionsService,
    private fb : FormBuilder , private location : Location , private translateService : TranslateService) {

      this.createForm();
  }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((ev : LangChangeEvent) => {
      this.lang = ev.lang;
    })
  }

 
  onImageSelected(ev) {
    let file = ev.target.files[0];
    if (file) {
      this.file = file;
      let reader = new FileReader();
      reader.onloadend = (ev : any) => {
        this.imageURL = ev.target.result
      }
      reader.readAsDataURL(file);
    }
  }

  createForm() {
    this.form = this.fb.group({
      name : ['' , Validators.required],
      phone : ['' , Validators.required],
      email : ['' , [Validators.required  , Validators.email]],
      password : ['' , Validators.required],
      repassword : ['' , Validators.required],
    })
  }

  onSubmit() {
    
    let form = this.form.value;
    if (form.password !== form.repassword) {
      return this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.checkPassword') , '');

    }

    let code : any = Config.countryCode;
     let phone = parsePhoneNumberFromString(form.phone, code);
     
      if (phone) {
        // if (!phone.isValid()) {
        //   return this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.checkPhone') , '');
        // } 
        this.loading = true;
        this.phone = phone.number;
        if (this.userId) {
          this.saveImage();
        } else {  
        this.dataService.postData('users' ,{email : form.email , password : form.password , name : form.name , phone :  this.phone})
          .subscribe((user : any) => {
            this.userId = user.id;
            this.saveImage();

            } , err => {
              this.loading = false;
              if (err.status == 422) {
                this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.emailUsed') , '');
              } else {
                this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
              }
            })
      }
    }
    
  }

  saveImage() {
    if (this.file) {
      this.dataService.upload(this.file)
      .subscribe((upload : any) => {
        this.saveCustomer( upload.result.files.file[0].name);
      } , err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
    }
    else {
      this.saveCustomer('');
    }
  }

  saveCustomer(imageURL) {
    let customer : Customer = {
      owner : this.userId,
      name : this.form.value.name,
      phone : this.phone,
      image :imageURL
    }
    this.dataService.postData('customers' , customer)
      .subscribe(res => {
        this.loading = false;
        this.back();
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.saved') , '');
      } , err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

  back() {
    this.location.back()
  }
}
