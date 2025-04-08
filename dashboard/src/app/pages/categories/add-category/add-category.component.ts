import { Category } from './../../../../shared/category';
import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent{

  form : FormGroup;
  loading : boolean = false;
  file : any;

  constructor(private fb : FormBuilder , private dataService : DataService , 
    private functionsService : FunctionsService , private nbdialogRef : NbDialogRef<any> , 
    private translateService : TranslateService) { 
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name : ['' , Validators.required]
    });
  }

  onImageSelect(ev) {
    let file = ev.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  onSubmit() {
    this.loading = true;
    let form = this.form.value;
    this.dataService.upload(this.file)
      .subscribe((upload : any) => {

        let category : Category = {
          image : upload.result.files.file[0].name,
          name : form.name
        }
        this.dataService.postData(`categories` , category)
          .subscribe(res => {
            this.loading = false;
            this.nbdialogRef.close();
            this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');

          }, err => {
            this.loading = false;
            this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
          })
      } , err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })

  }

}
