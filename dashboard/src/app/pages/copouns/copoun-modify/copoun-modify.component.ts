import { Component, OnInit } from '@angular/core';
import { Copoun } from '../../../../shared/copoun';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'copoun-modify',
  templateUrl: './copoun-modify.component.html',
  styleUrls: ['./copoun-modify.component.scss']
})
export class CopounModifyComponent implements OnInit {

  copoun : Copoun;
  isEditing : boolean;
  loading : boolean;
  form : FormGroup

  constructor(private dataService : DataService , private functionsService : FunctionsService , 
    private translateService : TranslateService , private fb : FormBuilder , private dialogRef : NbDialogRef<CopounModifyComponent>) { 

      this.createForm();
    }

  ngOnInit() {
  }


  createForm() {
    this.copoun = this.dataService.navParams.copoun;
    this.isEditing = this.copoun ? true : false;    
    this.form = this.fb.group({
      code : [this.isEditing ? this.copoun.code : '' , Validators.required],
      discount : [this.isEditing ? this.copoun.discount : '' , Validators.required],
      validUntil : [this.isEditing ? new Date(this.copoun.validUntil) : '' , Validators.required]
    });
  }

  onSubmit() {
    this.loading = true;
    let form = this.form.value;
    let copoun : Copoun = {
      code : form.code.toLowerCase(),
      discount : form.discount,
      validUntil : new Date(form.validUntil).getTime()
    }
    if (this.isEditing) copoun.id = this.copoun.id;
    this.dataService.updateData('copouns' , copoun)
      .subscribe(res => {
        this.loading = false;
        this.dataService.navParams = {};
        this.dialogRef.close();
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
        
      } , err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })

  }

}
