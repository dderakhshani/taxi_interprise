import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'on-trip',
  templateUrl: './on-trip.component.html',
  styleUrls: ['./on-trip.component.scss'],
})
export class OnTripComponent implements OnInit {

  @Input() activeTrip: TripModel;
  @Input() actionWaiting_accept: boolean;

  @Output() onEndTrip = new EventEmitter<void>();

  constructor(private callNumber: CallNumber) { }

  ngOnInit() { }

  endTripClick() {
    this.onEndTrip.emit();
  }

  onCallNumber() {
    this.callNumber.callNumber(this.activeTrip.DriverTrip.PhoneNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

}
