import { Component, NgZone, OnInit } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
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
import { AlertController, Platform } from '@ionic/angular';
import { SheetState } from 'ion-bottom-sheet';
import { DriverModel } from '../core/models/driver-model';
import { FcmModel } from '../core/models/fcm-model';
import { DriverViewState } from '../core/models/helpers/driver.view.state';
import { RejectReason } from '../core/models/reject-reasons-model';
import { TripModel } from '../core/models/trip-model';
import { DriverService } from '../core/services/driver.service';
import { GisApiService } from '../core/services/gis-api.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.page.html',
  styleUrls: ['./driver-home.page.scss'],
})
export class DriverHomePage implements OnInit {


  activeTrip: TripModel | null = null;
  driver: DriverModel;

  viewState: DriverViewState = DriverViewState.NewTrip;
  sheetState: SheetState = SheetState.Docked;
  sheetTitle: string = "سفر جدید";
  pageLoading: boolean = false;
  actionWaiting_accept: boolean = false;
  actionWaiting_reject: boolean = false;

  map: GoogleMap;
  currentMapLocation: LatLng = <LatLng>{
    lat: 32.674184,
    lng: 51.650664
  };


  constructor(public platform: Platform,
    private firebaseX: FirebaseX,
    private driverService: DriverService,
    private gisApiService: GisApiService,
    public alertController: AlertController,
    private zone: NgZone,
    private userService: UserService) {

    this.driver = this.userService.getCurrentUser().Driver;
  }

  ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.platform.ready().then(() => {
        console.log("------------platform is ready");
        this.loadMap();
        this.getActiveTrip();
      });
    }
    else {
      console.log("------------Browser platform");
      this.loadMap();
      this.getActiveTrip();
    }
    this.initFirebaseNotification();
    // this.firebase.hasPermission().then((isEnabled) => {
    //   if (!isEnabled)
    //     this.firebase.grantPermission().then(() => {
    //       this.initFirebaseNotification();
    //     });
    //   else
    //     this.initFirebaseNotification();
    // });
  }

  getActiveTrip() {
    this.driverService.getDriverActiveTrip(this.driver.Id).then(trip => {
      this.pageLoading = false;
      if (trip != null) {
        trip.from = new LatLng(trip.FromLatitude, trip.FromLongitude);
        trip.to = new LatLng(trip.ToLatitude, trip.ToLongitude);

        this.zone.run(() => {
          this.activeTrip = trip;
          if (this.activeTrip.Status == 2)
            this.setState(DriverViewState.NewTrip);
          else if (this.activeTrip.Status == 3)
            this.setState(DriverViewState.StartTrip);
          else if (this.activeTrip.Status == 4)
            this.setState(DriverViewState.OnTrip);
        });
        this.setMapPoints();

        this.gisApiService.getDistance(trip.from, trip.to).then(result => {
          this.zone.run(() => {
            this.activeTrip.distance = result.distance;
            this.activeTrip.duration = result.duration;
          });
        });


      }
    });
  }

  setState(state: DriverViewState) {
    this.sheetState = SheetState.Docked;
    this.viewState = state;
    if (state == DriverViewState.Empty) {
      this.sheetState = SheetState.Bottom;
    }
    if (state == DriverViewState.NewTrip)
      this.sheetTitle = "سفر جدید";
    if (state == DriverViewState.RejectTrip) {
      this.sheetState = SheetState.Top;
      this.sheetTitle = "در درخواست سفر";
    }
    else if (state == DriverViewState.StartTrip)
      this.sheetTitle = "سوار کردن مسافر";
    else if (state == DriverViewState.OnTrip)
      this.sheetTitle = "در حال سفر";
  }

  setMapPoints() {
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
    let pin_src = "pin_src.png";
    let pin_dest = "pin_dest.png";
    this.addMarker(origin, "مبدا", pin_src);
    this.addMarker(destination, "مقصد", pin_dest);
    this.showCurvedPolyline(origin, destination, 0.15);
  }

  acceptTrip() {
    this.actionWaiting_accept = true;
    this.driverService.acceptTrip(this.activeTrip.Id, this.driver.Id).then(trip => {
      this.activeTrip = trip;
      this.actionWaiting_accept = false;
      this.setState(DriverViewState.StartTrip);
    }).catch(x => {
      this.actionWaiting_accept = false;
    });
  }

  startTrip() {
    this.actionWaiting_accept = true;
    this.driverService.startTrip(this.activeTrip.Id, this.driver.Id).then(trip => {
      this.activeTrip = trip;
      this.actionWaiting_accept = false;
      this.setState(DriverViewState.OnTrip);
    }).catch(x => {
      this.actionWaiting_accept = false;
    });
  }

  async rejectTrip() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'تایید عدم پذیرش سفر',
      message: 'آیا از رد کردن سفر مطمئن می باشید؟',
      buttons: [
        {
          text: 'خیر',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'تایید عدم پذیرش',
          handler: () => {
            this.setState(DriverViewState.RejectTrip);
          }
        }
      ]
    });

    alert.present();
  }

  endTrip() {
    this.actionWaiting_accept = true;
    this.driverService.endTrip(this.activeTrip.Id, this.driver.Id).then(trip => {
      this.activeTrip = trip;
      this.actionWaiting_accept = false;
      this.setState(DriverViewState.Empty);
    }).catch(x => {
      this.actionWaiting_accept = false;
    });
  }

  saveRejectReasons(rejectReasons: any[]) {
    this.sheetState = SheetState.Docked;
    this.viewState = DriverViewState.NewTrip;
    let reasons = "";
    rejectReasons.forEach(element => {
      if (element.isChecked)
        reasons += element.title + ",";
    });
    this.actionWaiting_reject = true;
    this.driverService.rejectTrip(this.activeTrip.Id, this.driver.Id, reasons).then(trip => {
      this.actionWaiting_reject = false;
      this.setState(DriverViewState.Empty);

    }).catch(x => {
      this.actionWaiting_reject = false;
    });
  }

  loadMap() {

    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': '(your api key for `https://`)',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyB4MSUXdE15XLHm6gtBKzNcawD1uOE1CI4'
    });


    let center = <LatLng>{
      lat: this.currentMapLocation.lat,
      lng: this.currentMapLocation.lng
    };

    if (this.activeTrip != null)
      center = <LatLng>{
        lat: (this.activeTrip.FromLatitude + this.activeTrip.ToLatitude) / 2,
        lng: (this.activeTrip.FromLongitude + this.activeTrip.ToLongitude) / 2
      };

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: center,
        zoom: 14,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let self = this;
    this.map.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(() => {
      self.sheetState = SheetState.Bottom;
    });

    this.map.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(() => {
      self.sheetState = SheetState.Docked;

    });
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
      geodesic: false
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


  initFirebaseNotification() {
    // this.firebase.getToken().then(token => {
    //   console.log(`The token is ${token}`);
    //   // UserService.set
    // });

    this.firebaseX.onMessageReceived().subscribe(message => {

      console.log("FCM message received by Home page");
      console.log(message.DataType);
      this.getActiveTrip();
    });


  }

}
