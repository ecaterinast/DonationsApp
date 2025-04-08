import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { FunctionsService } from '../../services/functions/functions.service';
import { Policy } from '../../../shared/policy';

@Component({
  selector: 'policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

  policy : Policy;

  constructor(private route : ActivatedRoute , private dataService : DataService , 
    private translateService : TranslateService , private funcionsService : FunctionsService) { }

  ngOnInit() {
    let params = this.route.snapshot.params;
    this.dataService.getData(`policies?filter=${JSON.stringify({where : {type : params.policyType}})}`)
      .subscribe((res : Policy[]) => {
        if (res.length != 0) {
          this.policy = res[0];
        }
      },err => {
        this.funcionsService.showToast('danger' , this.translateService.instant('MESSAGES.error') ,'');
      })
  }

}
