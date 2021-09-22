import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';

@Component({
  selector: 'new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['../driver-home.page.scss'],
})
export class NewTripComponent implements OnInit {

  @Input() activeTrip: TripModel;
  @Input() actionWaiting_accept: boolean;
  @Input() actionWaiting_reject: boolean;

  @Output() onAcceptTrip = new EventEmitter<void>();
  @Output() onRejectTrip = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  acceptTripClick() {
    this.onAcceptTrip.emit();
  }

  rejectTripClick() {
    this.onRejectTrip.emit();
  }
}
