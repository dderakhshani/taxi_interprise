import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteLocationsPage } from './favorite-locations.page';

const routes: Routes = [
  {
    path: '',
    component: FavoriteLocationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteLocationsPageRoutingModule {}
