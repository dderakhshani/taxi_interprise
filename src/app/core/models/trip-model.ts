import { LatLng } from "@ionic-native/google-maps";
import { DriverModel } from "./driver-model";

export interface TripModel {
    from: LatLng,
    to: LatLng,
    distance: string;
    duration: string;
    distanceValue: number;
    durationValue: number;

    DriverTrip: DriverModel;
    Id: number;
    DriverId: number;
    FromAddress: string;
    ToAddress: string;
    DateTime: Date;
    CustomerId: number;
    TypeTrip: number;
    RequestTime: Date;
    StartTime: Date;
    EndTime: Date;
    Status: number;

    CustomerName: string;
    UnitName: string;
    FromLatitude: number;
    FromLongitude: number;
    ToLatitude: number;
    ToLongitude: number;
    TypeTripName: string;
    PersianRequestTime: string;
    PersianStartTime: string;
    PersianDateTime: string;
    PersianEndTime: string;
    Score: number,
    Feedback: string
}