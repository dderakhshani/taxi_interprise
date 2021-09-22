import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'start-trip',
  templateUrl: './start-trip.component.html',
  styleUrls: ['./start-trip.component.scss'],
})
export class StartTripComponent implements OnInit {

  @Input() activeTrip: TripModel;
  @Input() actionWaiting_accept: boolean;

  @Output() startTrip = new EventEmitter<void>();

  constructor(private callNumber: CallNumber) { }

  ngOnInit() { }

  onCallNumber() {
    this.callNumber.callNumber(this.activeTrip.DriverTrip.PhoneNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  startTripClick() {
    this.startTrip.emit();
  }

}
