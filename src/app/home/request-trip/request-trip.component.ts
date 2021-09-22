import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';


@Component({
  selector: 'request-trip',
  templateUrl: './request-trip.component.html',
  styleUrls: ['../home.page.scss'],
})
export class RequestTripComponent implements OnInit {
  @Input() activeTrip: TripModel;
  @Input() tripTime: string;
  @Output() tripTimeChange = new EventEmitter<string>();

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onChangeOrigin = new EventEmitter<void>();
  @Output() onChangeDestination = new EventEmitter<void>();
  @Output() onSelectOption = new EventEmitter<void>();
  @Output() onSelectTime = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }


  onClick() {
    this.onConfirm.emit();
  }

  onChangeOriginClick() {
    this.onChangeOrigin.emit();
  }

  onChangeDestinationClick() {
    this.onChangeDestination.emit();
  }

  onSelectOptionClick() {
    this.onSelectOption.emit();
  }

  onSelectTimeClick() {
    this.onSelectTime.emit();
  }

  setTripTimeNow() {
    this.tripTimeChange.emit('now');
    //tripTime='now'
  }

}
