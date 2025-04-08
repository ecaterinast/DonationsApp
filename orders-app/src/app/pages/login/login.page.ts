import { DataService } from '../../providers/data/data.service';
import { FunctionsService } from '../../providers/functions/functions.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  direction: string;
  showFormErrors: boolean;

  constructor(private navCtrl: NavController, private fb: FormBuilder,
    private functionsService: FunctionsService, private dataService: DataService,
    private storage: Storage, private translateService: TranslateService) {
    this.createForm();
  }

  ngOnInit() {
    this.functionsService.getDirection().subscribe(dir => this.direction = dir);
  }

  createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });

  }



  onSubmit() {
    if (!this.form.valid) {
      return this.showFormErrors = true;
    }
    else {
      this.showFormErrors = false;
    }
    this.functionsService.presentLoading();
    let form = this.form.value;

    this.dataService.login(form)
      .then((res: any) => {
        this.functionsService.dismissLoading();
        this.storage.set('access_token' , res.id).then(_ => this.navCtrl.navigateRoot('/tabs'));
      })
      .catch(err => {
        this.functionsService.dismissLoading();
        if (err.status == 401) {
          return this.functionsService.presentToast(this.translateService.instant('MESSAGES.incorrectCredentials'));
        }
        this.functionsService.presentToast(this.translateService.instant('MESSAGES.error'));
      })
  }

  notValid(formControl: string) {
    let control = this.form.get(formControl);
    return control.invalid && control.touched;
  }

}
