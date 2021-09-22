import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';

@Component({
  selector: 'wait-for-trip',
  templateUrl: './wait-for-trip.component.html',
  styleUrls: ['../home.page.scss'],
})
export class WaitForTripComponent implements OnInit {
  @Input()
  activeTrip: TripModel;
  @Input()
  actionWaiting: boolean;

  @Output()
  onConfirm = new EventEmitter<void>();
  constructor() { }

  ngOnInit() { }

  onClick() {
    this.onConfirm.emit();
  }
}
