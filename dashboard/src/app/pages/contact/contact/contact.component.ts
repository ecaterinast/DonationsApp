import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
import { TranslateService } from '@ngx-translate/core';
import { Contact } from '../../../../shared/contact';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  form : FormGroup;
  loading : boolean;
  contact : Contact;

  constructor(private fb : FormBuilder , private dataService : DataService , private functionsService : FunctionsService , 
    private translateService : TranslateService) { 
      this.createForm();
    }
    

  ngOnInit() {
    this.getContactInfo();
  }

  createForm() {
    this.form = this.fb.group({
      phone : ['', Validators.required],
      sms : ['', Validators.required],
      email : ['', Validators.required],
      facebook : ['', Validators.required],
      whatsapp : ['', Validators.required],
      telegram : ['', Validators.required],
    });
  }


  getContactInfo() {
    this.loading = true;
    this.dataService.getData(`contacts`)
      .subscribe((contacts : Contact[]) => {
        this.loading = false;
        if (contacts[0]) {
          this.contact = contacts[0];
            this.form.patchValue({
              'phone' : this.contact.phone,
              'sms' : this.contact.sms,
              'email' : this.contact.email,
              'facebook' : this.contact.facebook,
              'whatsapp' : this.contact.whatsapp,
              'telegram' : this.contact.telegram,
            });
        }
       
       
      } , err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      });
  }

  onSubmit() {
    this.loading = true;
    let form = this.form.value;
    let contact : Contact = {
       phone : form.phone,
       sms : form.sms,
       email : form.email,
       facebook : form.facebook,
       whatsapp : form.whatsapp,
       telegram : form.telegram,

    }
    if (this.contact) contact.id = this.contact.id;
    this.dataService.updateData('contacts', contact)
      .subscribe(res => {
        this.loading = false;
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
      } , err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }



}
