import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Brand } from '../../../../shared/brand';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent  {

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

        let brand : Brand = {
          image : upload.result.files.file[0].name,
          name : form.name
        }
        this.dataService.postData(`brands` , brand)
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
