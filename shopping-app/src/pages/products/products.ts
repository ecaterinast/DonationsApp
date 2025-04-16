import { Component, OnInit } from '@angular/core';
//import { DataService } from '../../services/data.service';
import { DataProvider } from '../../providers/data/data';

import {IonicPage} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  styleUrls: ['./items.scss'],
})
export class ItemsPage implements OnInit {
  items: any[] = [];

  constructor(private dataService: DataProvider) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    // this.dataService.getData('items').subscribe(
    //   (data: any[]) => {
    //     this.items = data;
    //   },
    //   (error) => {
    //     console.error('Error loading items', error);
    //   }
    // );
  }

  addItem() {
    //this.router.navigate(['/items/edit']);
  }

  editItem(itemId: string) {
   // this.router.navigate([`/items/edit/${itemId}`]);
  }
}
