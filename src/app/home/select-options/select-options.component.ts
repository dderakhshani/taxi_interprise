import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['../home.page.scss'],
})
export class SelectOptionsComponent implements OnInit {

  @Input() tripStopTime: string;
  @Input() roundTrip: boolean;
  @Output() tripStopTimeChange = new EventEmitter<string>();

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onSelectStop = new EventEmitter<void>();
  @Output() onSelectRoundTrip = new EventEmitter<void>();
  constructor() { }

  ngOnInit() { }

  onClick() {
    this.onConfirm.emit();
  }

  onSelectStopClick() {
    this.onSelectStop.emit();
  }

  onSelectRoundTripClick() {
    this.onSelectRoundTrip.emit();
  }

}
