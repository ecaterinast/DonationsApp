import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
import { TranslateService } from '@ngx-translate/core';
import { Policy, PolicyType } from '../../../../shared/policy';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  form : FormGroup;
  loading : boolean;
  marketPolicy : Policy;
  ordersPolicy : Policy;
  

  constructor(private fb : FormBuilder , private dataService : DataService , 
    private functionsService : FunctionsService , private translateService : TranslateService) { 
      this.createForm();
    }

  ngOnInit() {
    this.getPolicy();
  }

  createForm() {
    this.form = this.fb.group({
      marketPolicy : ['' , Validators.required],
      ordersPolicy : ['' , Validators.required]
    });
  }

  getPolicy() {
    this.loading = true;
    this.dataService.getData('policies')
      .subscribe((policies : Policy[]) => {
        this.loading = false;
         this.marketPolicy = policies.filter(policy => {return policy.type == PolicyType.market})[0];
         this.ordersPolicy = policies.filter(policy => {return policy.type == PolicyType.orders})[0];
        this.form.patchValue({
          marketPolicy : this.marketPolicy? this.marketPolicy.body : '',
          ordersPolicy : this.ordersPolicy? this.ordersPolicy.body : ''
        });
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'),'');
      })
  }


  onSubmit() {
    this.loading = true;
    let form = this.form.value;
    let marketPolicy : Policy = {
      type : PolicyType.market,
      body : form.marketPolicy
    }
    let ordersPolicy : Policy= {
      type : PolicyType.orders,
      body : form.ordersPolicy
    }
    if (this.marketPolicy) {
      marketPolicy.id = this.marketPolicy.id;
    }
    if(this.ordersPolicy) {
      ordersPolicy.id = this.ordersPolicy.id
    }

    forkJoin([
      this.dataService.updateData('policies' , marketPolicy),
      this.dataService.updateData('policies' , ordersPolicy),
    ])
    .subscribe(res => {
      this.loading = false;
      this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved'),'');
    } , err => {
      this.loading = false;
      this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error'),'');
    })

    
  }

}
