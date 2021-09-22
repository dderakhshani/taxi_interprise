import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteLocationsPageRoutingModule } from './favorite-locations-routing.module';

import { FavoriteLocationsPage } from './favorite-locations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteLocationsPageRoutingModule
  ],
  declarations: [FavoriteLocationsPage]
})
export class FavoriteLocationsPageModule {}
