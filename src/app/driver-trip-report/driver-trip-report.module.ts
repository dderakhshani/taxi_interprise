import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverTripReportPageRoutingModule } from './driver-trip-report-routing.module';

import { DriverTripReportPage } from './driver-trip-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverTripReportPageRoutingModule
  ],
  declarations: [DriverTripReportPage]
})
export class DriverTripReportPageModule {}
