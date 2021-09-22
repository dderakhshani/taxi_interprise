import { Component, NgZone, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  Spherical,
  LatLng,
  PolylineOptions,
  ILatLng
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AlertController, PickerController, Platform, ToastController } from '@ionic/angular';


import { SheetState } from 'ion-bottom-sheet';
import { RiderViewState } from '../core/models/helpers/rider-view-state';
import { RiderService } from '../core/services/rider.service';
import { TripModel } from '../core/models/trip-model';
import { DriverModel } from '../core/models/driver-model';
import { FcmModel } from '../core/models/fcm-model';
import { CustomerModel } from '../core/models/customer-model';
import { UserService } from '../core/services/user.service';
import { GisApiService } from '../core/services/gis-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  customer: CustomerModel;
  activeTrip?: TripModel = null;
  tempTrip: TripModel = <TripModel>{};
  drivers: DriverModel[] = [];

  tripTime: string = "now";
  tripStopTime: string = "";
  roundTrip: boolean = false;
  viewState: RiderViewState = RiderViewState.SelectOrigin;
  sheetState: SheetState = SheetState.Docked;
  actionPaneTitle: string;
  dockedHeight: number = 50;
  pageLoading: boolean = false;
  actionWaiting: boolean = false;


  map: GoogleMap;
  map_dragged: boolean = false;
  currentMapLocation: LatLng;
  marker: Marker;

  constructor(public platform: Platform,
    private geolocation: Geolocation,
    private firebaseX: FirebaseX,
    private gisApiService: GisApiService,
    private pickerController: PickerController,
    private toastCtrl: ToastController,
    private riderService: RiderService,
    private userService: UserService,
    private zone: NgZone,
    public alertController: AlertController) {
    this.customer = this.userService.getCurrentUser().Customer;
    this.setState(1);
  }

  ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.platform.ready().then(() => {
        console.log("------------platform is ready");
        this.loadMap();
      });
    }
    else {
      console.log("------------Browser platform");
      this.loadMap();
    }

    this.initFirebaseNotification();
    // this.firebase.hasPermission().then(isEnabled => {
    //   if (!isEnabled)
    //     this.firebase.grantPermission().then(() => {
    //       this.initFirebaseNotification();
    //     });
    //   else
    //     this.initFirebaseNotification();
    // })

    this.riderService.getDrivers(this.currentMapLocation).then(drivers => {
      this.drivers = drivers;

    });
    this.getActiveTrip();
  }

  getActiveTrip() {
    this.pageLoading = true;
    this.riderService.getCustomerActiveTrip(this.customer.Id).then(trip => {
      this.pageLoading = false;
      if (trip != null) {
        this.zone.run(() => {
          trip.from = new LatLng(trip.FromLatitude, trip.FromLongitude);
          trip.to = new LatLng(trip.ToLatitude, trip.ToLongitude);
          trip.PersianRequestTime = trip.PersianRequestTime.split(' ')[1];
          this.activeTrip = trip;

          this.gisApiService.getDistance(trip.from, trip.to).then(result => {
            this.zone.run(() => {
              this.activeTrip.distance = result.distance;
              this.activeTrip.duration = result.duration;
            });
          });
          // if (this.activeTrip.StartTime != null)
          //   this.setState(RiderViewState.OnTrip);
          if (this.activeTrip.Status < 3)
            this.setState(RiderViewState.WaitForAccept);
          else if (this.activeTrip.Status == 3)
            this.setState(RiderViewState.WaitForDriver);
          else if (this.activeTrip.Status == 4)
            this.setState(RiderViewState.OnTrip);
          else if (this.activeTrip.Status == 6)
            this.setState(RiderViewState.TripEnd);
        });


      }
      this.setMapPoints();
    });
  }

  tripTypeChanged(event) {

  }

  onConfirmOrigin() {
    this.tempTrip.from = this.currentMapLocation;
    this.setState(RiderViewState.SelectDestination);
    this.setMapPoints();
    this.getAddress(this.currentMapLocation.lat, this.currentMapLocation.lng).then(addr => {
      this.tempTrip.FromAddress = addr;
    });
  }

  changeOrigin() {

    // this.map.clear();

    // this.marker = this.addMarker(this.origin, this.getMarkerTite());
    this.currentMapLocation = this.tempTrip.from;

    this.tempTrip.from = null;
    this.tempTrip.to = null;
    this.setMapPoints();
    this.moveCameraToCurrent();
    this.setState(RiderViewState.SelectOrigin);
  }

  onConfirmDestination() {
    this.setState(RiderViewState.RequestTrip);
    this.tempTrip.to = this.currentMapLocation;
    this.setMapPoints();
    this.moveCameraToCurrent();
    this.getAddress(this.currentMapLocation.lat, this.currentMapLocation.lng).then(addr => {
      this.tempTrip.ToAddress = addr;
    });
  }

  changeDestination() {

    // this.addMarker(this.origin, this.getMarkerTite(), "marker_origin.png");
    // this.marker = this.addMarker(this.destination, this.getMarkerTite());
    this.currentMapLocation = this.tempTrip.to;
    this.tempTrip.to = null;
    this.setMapPoints();
    this.moveCameraToCurrent();
    this.setState(RiderViewState.SelectDestination);
  }

  onSelectOption() {
    this.setState(RiderViewState.SelectOptions);
  }

  selectStop() {
    this.openStopTimePicker();
  }

  onSelectRoundTrip() {
    this.roundTrip = !this.roundTrip;
  }
  onSelectTime() {
    this.openTimePicker();
    //this.setState(RiderViewState.SelectTime);
  }

  requestTrip() {
    let trip: TripModel = <TripModel>{
      FromLatitude: this.tempTrip.from.lat,
      FromLongitude: this.tempTrip.from.lng,
      ToLatitude: this.tempTrip.to.lat,
      ToLongitude: this.tempTrip.to.lng,
      TypeTrip: 1,
      FromAddress: this.tempTrip.FromAddress,
      ToAddress: this.tempTrip.ToAddress,
      PersianRequestTime: this.tripTime
    };
    this.riderService.requestTrip(trip).then(response => {
      this.activeTrip = response;
      this.setState(RiderViewState.WaitForAccept);
    })

  }

  async cancelTrip() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'تایید لغو سفر',
      message: 'آیا از لغو  سفر مطمئن می باشید؟',
      buttons: [
        {
          text: 'خیر',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'لغو سفر',
          handler: () => {
            this.actionWaiting = true;
            this.riderService.cancelTrip(this.activeTrip.Id, 1).then(trip => {

              this.setState(RiderViewState.SelectOrigin);
              this.zone.run(() => {
                this.actionWaiting = false;
                this.activeTrip = null;
                this.tempTrip.from = null;
                this.tempTrip.to = null;
                this.setMapPoints();
              });

            }).catch(error => {
              this.actionWaiting = false;
            });
          }
        }
      ]
    });

    alert.present();

  }

  onFeedback() {
    this.actionWaiting = true;
    this.riderService.tripFeedback(this.activeTrip.Score, this.activeTrip.Feedback, this.activeTrip.Id).then(drivers => {
      this.actionWaiting = false;
      this.setState(RiderViewState.SelectOrigin);
      const toast = this.toastCtrl.create({
        message: "با تشکر از شما نظرتان ثبت گردید",
        duration: 3000,
        position: 'bottom',
      });
      toast.then(data => data.present());
    });
  }

  getMarkerTite() {
    if (this.viewState == RiderViewState.SelectOrigin) {
      return "انتخاب مبدا";
    }
    else if (this.viewState == RiderViewState.SelectDestination) {
      return "انتخاب مقصد";
    }
  }

  setState(state: RiderViewState) {

    this.dockedHeight = 270;
    this.zone.run(() => { // <== added
      this.viewState = state;
      if (this.viewState == RiderViewState.SelectOrigin) {
        this.actionPaneTitle = "کجا هستید؟";
      }
      else if (this.viewState == RiderViewState.SelectDestination) {
        this.actionPaneTitle = "به کجا می روید؟";
        this.dockedHeight = 310;
      }
      else if (this.viewState == RiderViewState.RequestTrip) {
        this.actionPaneTitle = "شروع سفر";
        this.dockedHeight = 310;
      }
      else if (this.viewState == RiderViewState.SelectOptions) {
        this.actionPaneTitle = "انتخاب گزینه های سفر ";
        this.dockedHeight = 320;
      }
      else if (this.viewState == RiderViewState.WaitForAccept) {
        this.actionPaneTitle = "در انتظار تخصیص راننده";
        this.dockedHeight = 300;
      }
      else if (this.viewState == RiderViewState.WaitForDriver) {
        this.actionPaneTitle = "راننده  در راه";
        this.dockedHeight = 270;
      }
      else if (this.viewState == RiderViewState.OnTrip) {
        this.actionPaneTitle = "در سفر";
        this.dockedHeight = 270;
      }
      else if (this.viewState == RiderViewState.TripEnd) {
        this.actionPaneTitle = "پایان سفر";
        this.sheetState = SheetState.Top
      }
    });

  }

  getAddress(lat, lng): Promise<string> {
    return this.gisApiService.getLocationAddress(lat, lng);
  }

  // address
  pretifyAddress(address) {
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        data += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }

  loadMap() {

    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': '(your api key for `https://`)',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyB4MSUXdE15XLHm6gtBKzNcawD1uOE1CI4'
    });
    this.currentMapLocation = <LatLng>{
      lat: 32.674184,
      lng: 51.650664
    };
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: this.currentMapLocation,
        zoom: 14,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);


    var self = this;
    //this.setMapPoints();


    this.map.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(() => {
      this.zone.run(() => { // <== added
        self.map_dragged = true;
        self.sheetState = SheetState.Bottom;
      });

    });

    this.map.on(GoogleMapsEvent.MAP_DRAG).subscribe(() => {
      if (this.activeTrip == null && this.marker != null)
        this.marker.setPosition(this.map.getCameraTarget());
    });

    this.map.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(() => {
      if (self.map_dragged == true) {
        self.map_dragged = false;
        this.zone.run(() => {
          self.sheetState = SheetState.Docked;
        });
        self.currentMapLocation = <LatLng>this.map.getCameraTarget();

      }
    });
  }

  setMapPoints() {
    this.map.clear();
    if (this.marker != null) {
      this.marker.remove();
      this.marker = null;
    }

    let pin_src = "pin_src.png";
    let pin_dest = "pin_dest.png";
    if (this.viewState < 3)
      for (var i = 0; i < this.drivers.length; i++) {
        let driver = this.drivers[i];
        this.addMarker({ lat: driver.Latitude, lng: driver.Longitude }, driver.CarName, "taxi.png");
      }
    if (this.activeTrip != null) {
      let center = <LatLng>{
        lat: (this.activeTrip.FromLatitude + this.activeTrip.ToLatitude) / 2,
        lng: (this.activeTrip.FromLongitude + this.activeTrip.ToLongitude) / 2
      };
      let camera: CameraPosition<ILatLng> = {
        target: center,
        zoom: 14,
        tilt: 30
      };
      this.map.moveCamera(camera);


      let origin = <LatLng>{
        lat: this.activeTrip.FromLatitude,
        lng: this.activeTrip.FromLongitude
      };
      let destination = <LatLng>{
        lat: this.activeTrip.ToLatitude,
        lng: this.activeTrip.ToLongitude
      };
      this.addMarker(origin, "مبدا", pin_src);
      this.addMarker(destination, "مقصد", pin_dest);
      this.showCurvedPolyline(origin, destination, 0.15);
    }
    else {
      if (this.tempTrip.from != null)
        this.addMarker(this.tempTrip.from, this.getMarkerTite(), pin_src);

      if (this.tempTrip.to != null) {
        this.addMarker(this.tempTrip.to, this.getMarkerTite(), pin_dest);
        this.showCurvedPolyline(this.tempTrip.from, this.tempTrip.to, 0.15);
      }
      else {
        this.marker = this.addMarker(this.currentMapLocation, this.getMarkerTite());
        this.marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          if (this.viewState == RiderViewState.SelectOrigin)
            this.onConfirmOrigin();
          else if (this.viewState == RiderViewState.SelectDestination)
            this.onConfirmDestination();
        });
      }
    }
  }

  moveCameraToCurrent() {
    let camera: CameraPosition<ILatLng> = {
      target: this.currentMapLocation,
      zoom: 14,
      tilt: 30
    };
    this.map.moveCamera(camera);
  }

  addMarker(position: any, title: string, iconName: string = "") {
    let iconUrl = './assets/icon/';
    if (iconName == "")
      iconName = 'marker1.png';

    iconUrl += iconName;
    let marker: Marker = this.map.addMarkerSync({
      title: title,
      icon: { url: iconUrl },
      animation: 'DROP',
      position: position
    });
    return marker;
  }

  showCurvedPolyline(p1: LatLng, p2: LatLng, k: number) {
    //Calculate distance and heading between two points
    let d = Spherical.computeDistanceBetween(p1, p2);
    let h = Spherical.computeHeading(p1, p2);

    //Midpoint position
    let p: LatLng = Spherical.computeOffset(p1, d * 0.5, h);

    //Apply some mathematics to calculate position of the circle center
    let x: number = (1 - k * k) * d * 0.5 / (2 * k);
    let r: number = (1 + k * k) * d * 0.5 / (2 * k);

    let c: LatLng = Spherical.computeOffset(p, x, h + 90.0);

    //Polyline options
    let options: PolylineOptions = <PolylineOptions>{
      width: 5,
      color: '#3389aa',
      geodesic: true
    };

    //Calculate heading between circle center and two points
    let h1: number = Spherical.computeHeading(c, p1);
    let h2: number = Spherical.computeHeading(c, p2);

    //Calculate positions of points on circle border and add them to polyline options
    let numpoints = 100;
    let step: number = (h2 - h1) / numpoints;
    options.points = [];
    for (var i = 0; i < numpoints; i++) {
      let pi: LatLng = Spherical.computeOffset(c, r, h1 + i * step);
      options.points.push(pi);
    }

    //Draw polyline
    this.map.addPolyline(options);
  }

  async openTimePicker() {
    const picker = await this.pickerController.create({
      columns: this.getColumns(),
      cssClass: "mypicker",
      buttons: [
        {
          text: 'لغو',
          role: 'cancel'
        },
        {
          text: 'تایید',
          handler: (value) => {
            console.log(`Got Value ${value}`);
            this.tripTime = value.colHour.text + value.colMinute.text;
          }
        }
      ]
    });

    await picker.present();
  }

  async openStopTimePicker() {
    let columns = [];
    let options = [];


    options.push({
      text: "0 تا 15 دقیقه",
      value: 1
    });
    options.push({
      text: "15 تا 30 دقیقه",
      value: 2
    });
    options.push({
      text: "30 تا 45 دقیقه",
      value: 3
    });
    options.push({
      text: "45 دقیقه تا 1 ساعت",
      value: 4
    });
    options.push({
      text: "1 تا 1.5 ساعت",
      value: 5
    });

    options.push({
      text: "1.5 تا 2 ساعت",
      value: 5
    });
    columns.push({
      name: `col`,
      cssClass: "picker-hour",
      options: options
    });
    const picker = await this.pickerController.create({
      columns: columns,
      cssClass: "mypicker",
      buttons: [
        {
          text: 'لغو',
          role: 'cancel'
        },
        {
          text: 'تایید',
          handler: (value) => {
            console.log(`Got Value ${value}`);
            this.tripStopTime = value.col.text;
          }
        }
      ]
    });

    await picker.present();
  }

  getColumns() {
    let columns = [];
    let options = [];
    var h = new Date().getHours();
    var m = new Date().getMinutes();
    for (let i = 0; i < 25; i++) {

      options.push({
        text: (i < 9 ? "0" : "") + i + ":",
        value: i,
        selected: h == i
      })
    }
    columns.push({
      name: `colHour`,
      cssClass: "picker-hour",
      align: "left",
      options: options
    });

    options = [];
    for (let i = 0; i < 60; i++) {
      options.push({
        text: (i < 9 ? "0" : "") + i + "",
        value: i,
        selected: m == i
      })
    }
    columns.push({
      name: `colMinute`,
      cssClass: "picker-minute",
      options: options
    });

    options = [];
    options.push({
      text: "امروز",
      value: 0
    });
    options.push({
      text: "فردا",
      value: 0
    });

    columns.push({
      name: `colDay`,
      options: options
    });
    return columns;
  }

  initFirebaseNotification() {
    this.firebaseX.getToken().then(token => {
      console.log(`The token is ${token}`);
      localStorage.setItem('fcm-token', token);
    });
    this.firebaseX.onMessageReceived().subscribe(message => {
      console.log("FCM message received by Home page");
      console.log(message.DataType);
      this.getActiveTrip();
    });
  }
}
