import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Brand } from '../../../../shared/brand';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent  {

  form : FormGroup;
  loading : boolean = false;
  file : any;
  brand : Brand;
  
  
  constructor(private fb : FormBuilder , private dataService : DataService , 
    private functionsService : FunctionsService , private nbdialogRef : NbDialogRef<any>,
    private translateService : TranslateService) { 
    this.createForm();
  }


  createForm() {
    this.brand = this.dataService.navParams.brand
    this.form = this.fb.group({
      name : [this.brand.name , Validators.required]
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
        this.updatebrand(upload.result.files.file[0].name);
        } , err => {
          this.loading = false;
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
        })
    } else {
      this.updatebrand(this.brand.image);
    }
    
  }

  updatebrand(imageURL) {

    let form = this.form.value;
    let brand : Brand = {
      image : imageURL,
      name : form.name
    }
    this.dataService.updateData(`brands/${this.brand.id}` , brand)
      .subscribe(res => {
        this.loading = false;
        this.nbdialogRef.close();
        this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
        if (this.file) this.dataService.deleteData('containers/images/files/' + this.brand.image).subscribe();
      }, err => {
        this.loading = false;
        this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');
      })
  }

}
