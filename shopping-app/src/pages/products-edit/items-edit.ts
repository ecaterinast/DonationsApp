import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { DataService } from '../../services/data.service';
import { DataProvider } from '../../providers/data/data';
import {IonicPage} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'app-edit',
  templateUrl: './items-edit.html',
  styleUrls: ['./items-edit.scss'],
})
export class ItemsEditPage implements OnInit {
  itemForm: FormGroup;
  itemId: string | null = null;
  mapCenter: { lat: number; lng: number } = { lat: 37.7749, lng: -122.4194 }; // Default location

  constructor(
    private fb: FormBuilder,
    private dataService: DataProvider,
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      location: [null, Validators.required],
    });
  }

  ngOnInit() {
    // this.itemId = this.route.snapshot.paramMap.get('id');
    // if (this.itemId) {
    //   this.loadItem();
    // }
  }

  loadItem() {
    // this.dataService.getData(`items/${this.itemId}`).subscribe(
    //   (item) => {
    //     this.itemForm.patchValue(item);
    //     if (item.location) {
    //       this.mapCenter = item.location;
    //     }
    //   },
    //   (error) => {
    //     console.error('Error loading item', error);
    //   }
    // );
  }

  saveItem() {
    // if (this.itemForm.valid) {
    //   const itemData = this.itemForm.value;
    //   if (this.itemId) {
    //     this.dataService.updateData(`items/${this.itemId}`, itemData).subscribe(
    //       () =>
    //         // this.router.navigate(['/items']),
    //       (error) => console.error('Error updating item', error)
    //     );
    //   } else {
    //     this.dataService.postData('items', itemData).subscribe(
    //       // () => this.router.navigate(['/items']),
    //       (error) => console.error('Error creating item', error)
    //     );
    //   }
    // }
  }

  onMapClick(event: any) {
    this.itemForm.patchValue({ location: event.coords });
  }
}
