import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { IonBottomSheetModule } from 'ion-bottom-sheet';
import { StarRatingModule } from 'ionic5-star-rating';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonBottomSheetModule,
    StarRatingModule],
  providers: [
    {
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy,
    },
    HTTP,
    Geolocation,
    NativeGeocoder,
    FirebaseX,
    CallNumber
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
