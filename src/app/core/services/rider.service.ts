import { Injectable } from '@angular/core';
import { LatLng } from '@ionic-native/google-maps';
import { DriverModel } from '../models/driver-model';
import { TripModel } from '../models/trip-model';
import { HttpNativeService } from './http.native.service';
import { HttpService } from './http.service';
import { HttpWebService } from './http.web.service';

@Injectable({
  providedIn: 'root'
})
export class RiderService {
  httpservice: HttpService;
  constructor(http: HttpWebService) {
    this.httpservice = http;
  }

  requestTrip(tripRequest: any): Promise<TripModel> {
    return this.httpservice.postJsonData<TripModel>({ trp: tripRequest }, "AddTrip");
  }

  getCustomerActiveTrip(customerId: number): Promise<TripModel> {
    return this.httpservice.getDataByParam<TripModel>({ customerId: customerId }, "GetCustomerActiveTrip");
  }

  getCustomerTrips(customerId: number): Promise<TripModel[]> {
    return this.httpservice.getDataByParam<TripModel[]>({ customerId: customerId }, "GetCustomerTrips");
  }


  cancelTrip(tripId: number, customerId: number): Promise<TripModel> {
    return this.httpservice.getDataByParam<TripModel>({ tripId: tripId, customerId: customerId }, "CancelTrip");
  }

  getDrivers(origin: LatLng): Promise<DriverModel[]> {
    return this.httpservice.getData<DriverModel[]>("GetDrivers");
  }

  tripFeedback(score: number, feedbacks: string, tripId: number): Promise<string> {
    return this.httpservice.postJsonData<string>({ score: score, feedbacks: feedbacks, tripId: tripId }, "TripFeedback");
  }
}
