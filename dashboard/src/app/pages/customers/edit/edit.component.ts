import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Customer } from './../../../../shared/customer';
import { FunctionsService } from './../../../services/functions/functions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../services/data/data.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Config } from '../../../../shared/config';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit{

  imageURL : string = 'assets/imgs/avatar.png';
  file : File;
  form : FormGroup
  loading : boolean;
  phone : any;
  customer : Customer;
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

    this.customer = this.dataService.navParams;
    this.form = this.fb.group({
      name : [this.customer.name, Validators.required],
      phone : [this.customer.phone , Validators.required]
    })
  }

  onSubmit() {
    
    let form = this.form.value;
    let code : any = Config.countryCode;
     let phone = parsePhoneNumberFromString(form.phone, code)
      if (phone) {
        if (!phone.isValid()) {
          return this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.checkPhone') , '');
        } 
        this.loading = true;
        this.phone = phone.number;
        this.saveImage();  
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
      this.saveCustomer(this.customer.image);
    }
  }

  saveCustomer(imageURL) {
    let customer : Customer = {
      id : this.customer.id,
      owner : this.customer.owner,
      name : this.form.value.name,
      phone : this.phone,
      image :imageURL
    }
    this.dataService.updateData('customers' , customer)
      .subscribe(res => {
        this.loading = false;
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
