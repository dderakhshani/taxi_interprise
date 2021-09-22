import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLng } from '@ionic-native/google-maps';
import { Observable } from 'rxjs';
import { TripModel } from '../models/trip-model';
import { HttpService } from './http.service';
import { HttpWebService } from './http.web.service';

@Injectable({
  providedIn: 'root'
})
export class GisApiService {

  constructor(private http: HttpClient) {
  }

  getLocationAddress(lat, lng): Promise<string> {
    return new Promise(resolve => {
      const headers = { 'Api-Key': 'service.D5GmwDGpUIKVCq88fdvyvEmFYG6pT9RgsAcHXhYd' }
      return this.http.get<any>(`https://api.neshan.org/v2/reverse?lat=${lat}&lng=${lng}`, { headers }).subscribe(result => {
        return resolve(result.addresses[0].formatted);
      });
    });
  }

  getDistance(origin: LatLng, destination: LatLng): Promise<TripModel> {
    return new Promise(resolve => {
      const headers = { 'Api-Key': 'service.D5GmwDGpUIKVCq88fdvyvEmFYG6pT9RgsAcHXhYd' }
      return this.http.get<any>(
        `https://api.neshan.org/v3/direction?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`, { headers }).subscribe(result => {
          let t = <TripModel>{
            distance: result.routes[0].legs[0].distance.text,
            duration: result.routes[0].legs[0].duration.text
          };
          return resolve(t);
        });
    });
  }
}
