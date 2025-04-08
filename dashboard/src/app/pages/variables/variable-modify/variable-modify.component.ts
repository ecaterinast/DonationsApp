import { Component, OnInit } from '@angular/core';
import { Variable } from '../../../../shared/variable';
import { DataService } from '../../../services/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { FunctionsService } from '../../../services/functions/functions.service';
import { Location } from '@angular/common';

@Component({
  selector: 'variable-modify',
  templateUrl: './variable-modify.component.html',
  styleUrls: ['./variable-modify.component.scss']
})
export class VariableModifyComponent implements OnInit {

  variable : Variable;
  loading : boolean;
  isEditing : boolean;

  constructor(private dataService : DataService , private translateService : TranslateService , 
    private functionsService : FunctionsService , private location : Location) {
      this.createForm();

     }

  ngOnInit() {
   
  }


  createForm() {
    let variable = this.dataService.navParams.variable;
    this.isEditing = variable ? true : false;
    this.variable = this.isEditing ? variable : this.initializeVariable();
  }

  initializeVariable() : Variable {
    return {
      key : '',
      values : [{name : ''}]
   }
  }

  

  newValue() {
    this.variable.values.push({name : ''});
  }

  deleteValue(valueIndex) {
    this.variable.values.splice(valueIndex , 1);
  }

  save() {
      //validate variables section
      let err = false;
    
        if (this.variable.key.length == 0) {
            err = true;
           return this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.required') , '');
        }
  
        for (let j = 0; j < this.variable.values.length; j++) {
          const val = this.variable.values[j];
          if (val.name.length == 0 ) {
            err = true;
            this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.required') , '');
            break;
          }
        }
        
      if (err) return;
         
      this.loading = true;
      let variable;
      if (this.isEditing) {
        variable = this.variable;
      } else {
        variable = {
          ...this.variable
        }
      }

      this.dataService.updateData('variables' , variable)
        .subscribe(res => {
          this.loading = false;
          this.functionsService.showToast('success' , this.translateService.instant('MESSAGES.saved') , '');
          this.dataService.navParams = {};
          this.back();
        } , err => {
          this.loading = false;
          this.functionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') , '');

        })
  

  }

  back() {
    this.location.back();
    this.dataService.navParams = {};
  }




}
