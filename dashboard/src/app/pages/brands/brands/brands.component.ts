import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Brand } from '../../../../shared/brand';
import { DataService } from '../../../services/data/data.service';
import { FunctionsService } from '../../../services/functions/functions.service';
import { EditComponent } from '../edit/edit.component';
import { AddComponent } from '../add/add.component';

@Component({
  selector: 'brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  brands: Brand[];
  loading: boolean;

  constructor(public dataService: DataService, private functionsService: FunctionsService,
    private dialogService: NbDialogService, private translateService: TranslateService) {

  }

  ngOnInit() {
    this.getBrands();
  }

  getBrands() {
    this.dataService.getData('brands')
      .subscribe((brands: Brand[]) => {
        this.brands = brands;
      }, err => {
        this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
      })
  }

  add() {
    let dialogRef = this.dialogService.open(AddComponent);
    dialogRef.onClose.subscribe(() => this.getBrands());
  }

  delete(brand: Brand) {
    if (window.confirm(this.translateService.instant('MESSAGES.confirmDelete'))) {
      this.loading = true;
      this.dataService.deleteData('brands/' + brand.id)
        .subscribe(res => {
          this.dataService.deleteData('brands/' + brand.id)
            .subscribe(res => {
              this.getBrands();
              this.dataService.deleteData('containers/images/files/' + brand.image).subscribe();
              this.loading = false;
              this.functionsService.showToast('success', this.translateService.instant('MESSAGES.deleted'), '');

            }, err => {
              this.loading = false;
              this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
            })

        }, err => {
          this.loading = false;
          this.functionsService.showToast('danger', this.translateService.instant('MESSAGES.error'), '');
        })

    }
  }

  edit(brand: Brand) {
    this.dataService.navParams.brand = brand;
    let dialogRef = this.dialogService.open(EditComponent);
    dialogRef.onClose.subscribe(res => {
      this.getBrands();
      this.dataService.navParams = {};
    })
  }


}
