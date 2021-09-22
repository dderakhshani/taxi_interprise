import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';

@Component({
  selector: 'select-destination',
  templateUrl: './select-destination.component.html',
  styleUrls: ['../home.page.scss'],
})
export class SelectDestinationComponent implements OnInit {
  @Input() activeTrip: TripModel;
  @Output()
  onConfirm = new EventEmitter<void>();
  @Output()
  onChangeOrigin = new EventEmitter<void>();


  constructor() { }

  ngOnInit() { }


  onClick() {
    this.onConfirm.emit();
  }

  onChangeOriginClick() {
    this.onChangeOrigin.emit();
  }
}
