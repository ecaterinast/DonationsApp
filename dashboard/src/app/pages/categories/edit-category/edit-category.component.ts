import { Category } from './../../../../shared/category';
import { FunctionsService } from './../../../services/functions/functions.service';
import { DataService } from './../../../services/data/data.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent  {
  form : FormGroup;
  loading : boolean = false;
  file : any;
  category : Category;
  
  
  constructor(private fb : FormBuilder , private dataService : DataService , 
    private functionsService : FunctionsService , private nbdialogRef : NbDialogRef<any>,
    private translateService : TranslateService) { 
    this.createForm();
  }


  createForm() {
    this.category = this.dataService.navParams.category
    this.form = this.fb.group({
      name : [this.category.name , Validators.required]
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
    if (this.file) {
      this.dataService.upload(this.file)
        .subscribe((upload : any) => {
        this.updateCategory(upload.result.files.file[0].name);
        } , err => {
          this.loading = false;
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        })
    } else {
      this.updateCategory(this.category.image);
    }
    
  }

  updateCategory(imageURL) {

    let form = this.form.value;
    let category : Category = {
      image : imageURL,
      name : form.name
    }
    this.dataService.updateData(`categories/${this.category.id}` , category)
      .subscribe(res => {
        this.loading = false;
        this.nbdialogRef.close();
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
        if (this.file) this.dataService.deleteData('containers/images/files/' + this.category.image).subscribe();
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }
}
