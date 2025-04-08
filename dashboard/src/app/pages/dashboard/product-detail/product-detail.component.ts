import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../shared/product';
import { DataService } from '../../../services/data/data.service';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product : Product;

  constructor(public dataService : DataService , private nbDialogRef : NbDialogRef<ProductDetailComponent> , 
    private router : Router) { 
    this.product = this.dataService.navParams.product;
  }

  ngOnInit() {
  }

  edit() {
    this.nbDialogRef.close();
    this.router.navigateByUrl('pages/products/edit/' + this.product.id);
  }

}
