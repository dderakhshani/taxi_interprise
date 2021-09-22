import { Component, NgZone, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerModel } from '../core/models/customer-model';
import { TripModel } from '../core/models/trip-model';
import { RiderService } from '../core/services/rider.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.page.html',
  styleUrls: ['./trip-report.page.scss'],
})
export class TripReportPage implements OnInit {
  trips: TripModel[];
  pageLoading: boolean;
  customer: CustomerModel;
  serverUrl: string = environment.apiUrl;
  constructor(private riderService: RiderService,
    private userService: UserService,
    private zone: NgZone) {
    this.customer = this.userService.getCurrentUser().Customer;
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.pageLoading = true;
    this.riderService.getCustomerTrips(this.customer.Id).then(data => {
      this.pageLoading = false;
      this.zone.run(() => {
        this.trips = data;
      });
    });
  }
}
