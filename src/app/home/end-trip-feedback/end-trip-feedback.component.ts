import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TripModel } from 'src/app/core/models/trip-model';

@Component({
  selector: 'end-trip-feedback',
  templateUrl: './end-trip-feedback.component.html',
  styleUrls: ['../home.page.scss'],
})
export class EndTripFeedbackComponent implements OnInit {

  feedBackOptions = [
    0, 0
  ];
  @Input() activeTrip: TripModel;
  @Output() activeTripChange = new EventEmitter<TripModel>();

  @Input()
  actionWaiting: boolean;
  @Output()
  onConfirm = new EventEmitter<void>();

  score: number = 1;
  feedbacks: string;

  constructor() { }

  ngOnInit() { }

  ratingChange(event: any) {
    this.activeTrip.Score = event;
  }
  onClick() {
    this.activeTrip.Feedback = this.feedbacks;
    this.activeTripChange.emit(this.activeTrip);
    this.onConfirm.emit();
  }

}
