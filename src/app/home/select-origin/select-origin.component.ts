import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';

@Component({
  selector: 'select-origin',
  templateUrl: './select-origin.component.html',
  styleUrls: ['../home.page.scss'],
})
export class SelectOriginComponent implements OnInit {
  @Input() activeTrip: TripModel;
  @Output()
  onConfirm = new EventEmitter<void>();


  constructor() { }

  ngOnInit() { }


  onClick() {
    this.onConfirm.emit();
  }
}
