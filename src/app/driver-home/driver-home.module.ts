import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverHomePageRoutingModule } from './driver-home-routing.module';

import { DriverHomePage } from './driver-home.page';
import { IonBottomSheetModule } from 'ion-bottom-sheet';
import { NewTripComponent } from './new-trip/new-trip.component';
import { StartTripComponent } from './start-trip/start-trip.component';
import { RejectTripComponent } from './reject-trip/reject-trip.component';
import { OnTripComponent } from './on-trip/on-trip.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverHomePageRoutingModule,
    IonBottomSheetModule
  ],
  declarations: [DriverHomePage, NewTripComponent, StartTripComponent, RejectTripComponent, OnTripComponent]
})
export class DriverHomePageModule { }
