import { Injectable } from '@angular/core';
import { TripModel } from '../models/trip-model';
import { HttpService } from './http.service';
import { HttpWebService } from './http.web.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  httpservice: HttpService;
  constructor(webHttp: HttpWebService) {
    this.httpservice = webHttp;
  }


  getDriverActiveTrip(driverId: number): Promise<TripModel> {
    return this.httpservice.getDataByParam<TripModel>({ driverId: driverId }, "GetDriverActiveTrip");
  }

  getDriverTrips(driverId: number): Promise<TripModel[]> {
    return this.httpservice.getDataByParam<TripModel[]>({ driverId: driverId }, "GetDriverTrips");
  }

  acceptTrip(tripId: number, driverId: number): Promise<TripModel> {
    return this.httpservice.getDataByParam<TripModel>({ tripId: tripId, driverId: driverId }, "AcceptTrip");
  }

  startTrip(tripId: number, driverId: number): Promise<TripModel> {
    return this.httpservice.getDataByParam<TripModel>({ tripId: tripId, driverId: driverId }, "StartTrip");
  }

  endTrip(tripId: number, driverId: number): Promise<TripModel> {
    return this.httpservice.getDataByParam<TripModel>({ tripId: tripId, driverId: driverId }, "EndTrip");
  }

  rejectTrip(tripId: number, driverId: number, rejectReason: string): Promise<TripModel> {
    return this.httpservice.getDataByParam<TripModel>({ tripId: tripId, driverId: driverId, rejectReason: rejectReason }, "RejectTrip");
  }
}
