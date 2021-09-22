import { CustomerModel } from "./customer-model";
import { DriverModel } from "./driver-model";

export class UserModel {
    Id: number;
    Username: string;
    Password: string;
    UserType: number;
    FcmToken: string;
    Driver: DriverModel;
    Customer: CustomerModel;
}