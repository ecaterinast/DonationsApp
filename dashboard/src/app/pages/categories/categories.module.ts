import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NbDialogModule } from '@nebular/theme';

@NgModule({
  declarations: [ CategoriesComponent, AddCategoryComponent, EditCategoryComponent, SubCategoriesComponent],
  entryComponents : [AddCategoryComponent , EditCategoryComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    MaterialModule,
    TranslateModule,
    NbDialogModule.forChild({})
  ]
})
export class CategoriesModule { }
