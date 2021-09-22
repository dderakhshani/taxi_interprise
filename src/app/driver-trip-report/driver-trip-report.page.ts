import { Component, NgZone, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DriverModel } from '../core/models/driver-model';
import { TripModel } from '../core/models/trip-model';
import { DriverService } from '../core/services/driver.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-driver-trip-report',
  templateUrl: './driver-trip-report.page.html',
  styleUrls: ['./driver-trip-report.page.scss'],
})
export class DriverTripReportPage implements OnInit {
  trips: TripModel[];
  pageLoading: boolean;
  driver: DriverModel;
  serverUrl: string = environment.apiUrl;

  constructor(private driverService: DriverService,
    private userService: UserService,
    private zone: NgZone) {

    this.driver = this.userService.getCurrentUser().Driver;
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.pageLoading = true;
    this.driverService.getDriverTrips(this.driver.Id).then(data => {
      this.pageLoading = false;
      this.zone.run(() => {
        this.trips = data;
      });
    });
  }

}
