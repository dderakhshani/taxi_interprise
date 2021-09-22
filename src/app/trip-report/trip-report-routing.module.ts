import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripReportPage } from './trip-report.page';

const routes: Routes = [
  {
    path: '',
    component: TripReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripReportPageRoutingModule {}
