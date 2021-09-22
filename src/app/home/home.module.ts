import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { IonBottomSheetModule } from 'ion-bottom-sheet';
import { StarRatingModule } from 'ionic5-star-rating';
import { SelectOriginComponent } from './select-origin/select-origin.component';
import { SelectDestinationComponent } from './select-destination/select-destination.component';
import { RequestTripComponent } from './request-trip/request-trip.component';
import { SelectOptionsComponent } from './select-options/select-options.component';
import { WaitForTripComponent } from './wait-for-trip/wait-for-trip.component';
import { WaitForDriverComponent } from './wait-for-driver/wait-for-driver.component';
import { EndTripFeedbackComponent } from './end-trip-feedback/end-trip-feedback.component';
import { OnTripComponent } from './on-trip/on-trip.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonBottomSheetModule,
    StarRatingModule
  ],
  declarations: [HomePage,
    SelectOriginComponent,
    SelectDestinationComponent,
    RequestTripComponent,
    SelectOptionsComponent,
    WaitForTripComponent,
    WaitForDriverComponent,
    OnTripComponent,
    EndTripFeedbackComponent
  ]
})
export class HomePageModule { }
