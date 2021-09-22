import { Injectable } from '@angular/core';
import { UserModel } from '../models/user-model';
import { HttpService } from './http.service';
import { HttpWebService } from './http.web.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  httpservice: HttpService;

  constructor(http: HttpWebService) {
    this.httpservice = http;
  }

  login(username: string, password: string, fcmToken: string): Promise<UserModel> {
    return this.httpservice.postJsonData<UserModel>({ username: username, password: password, fcmToken: fcmToken }, "Login");
  }

  logOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('appMode');
  }


  saveUser(user: UserModel) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): UserModel {
    let user: UserModel = null;
    let userData = localStorage.getItem('user');
    if (userData != null && userData != "")
      user = JSON.parse(userData);
    return user;
  }

  setFcmToken(token: string) {
    localStorage.setItem('fcm-token', token);
  }

  getFcmToken() {
    let token = localStorage.getItem('fcm-token');
    if (token == null || token == "")
      token = "No Token Provided";
    return token;
  }

  setAppMode(mode: string) {
    localStorage.setItem('appMode', mode);
  }

  getAppMode() {
    let mode = localStorage.getItem('appMode');
    if (mode == null || mode == "")
      mode = "rider";
    return mode;
  }
}
