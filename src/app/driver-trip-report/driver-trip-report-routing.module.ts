import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverTripReportPage } from './driver-trip-report.page';

const routes: Routes = [
  {
    path: '',
    component: DriverTripReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverTripReportPageRoutingModule {}
