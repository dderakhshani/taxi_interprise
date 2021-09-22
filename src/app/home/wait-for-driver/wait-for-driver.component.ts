import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'wait-for-driver',
  templateUrl: './wait-for-driver.component.html',
  styleUrls: ['../home.page.scss'],
})
export class WaitForDriverComponent implements OnInit {
  @Input()
  activeTrip: TripModel;
  @Input()
  actionWaiting: boolean;

  @Output()
  onConfirm = new EventEmitter<void>();

  serverUrl = environment.apiUrl;
  constructor() { }

  ngOnInit() { }

  onClick() {
    this.onConfirm.emit();
    // this.activeTrip.PersianStartTime.split(' ')[1]
  }
}
