import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RejectReason } from 'src/app/core/models/reject-reasons-model';
import { TripModel } from 'src/app/core/models/trip-model';

@Component({
  selector: 'reject-trip',
  templateUrl: './reject-trip.component.html',
  styleUrls: ['./reject-trip.component.scss'],
})
export class RejectTripComponent implements OnInit {


  @Input() activeTrip: TripModel;
  @Input() actionWaiting_reject: boolean;

  @Output() onRejectTrip = new EventEmitter<any[]>();

  rejectReasons: RejectReason[] = [
    { title: "خرابی خودرو", type: 1, isChecked: false },
    { title: "پایان زمان کاری", type: 2, isChecked: false },
    { title: "مشغول کار", type: 3, isChecked: false },
    { title: "مشکل شخصی", type: 4, isChecked: false }
  ];

  constructor() { }

  ngOnInit() { }


  setRejectReason(reason: RejectReason) {
    reason.isChecked = !reason.isChecked;
  }

  onRejectClick() {
    this.onRejectTrip.emit(this.rejectReasons);
  }

}
