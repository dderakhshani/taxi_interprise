import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'on-trip',
  templateUrl: './on-trip.component.html',
  styleUrls: ['../home.page.scss'],
})
export class OnTripComponent implements OnInit {

  @Input()
  activeTrip: TripModel;
  @Input()
  actionWaiting: boolean;

  @Output()
  onConfirm = new EventEmitter<void>();

  serverUrl = environment.apiUrl;

  constructor() { }

  ngOnInit() { }

}
