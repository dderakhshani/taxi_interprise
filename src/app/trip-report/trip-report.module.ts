import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripReportPageRoutingModule } from './trip-report-routing.module';

import { TripReportPage } from './trip-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripReportPageRoutingModule
  ],
  declarations: [TripReportPage]
})
export class TripReportPageModule {}
