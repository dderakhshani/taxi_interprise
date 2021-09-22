import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'driver-home',
    loadChildren: () => import('./driver-home/driver-home.module').then(m => m.DriverHomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'select-version',
    loadChildren: () => import('./select-version/select-version.module').then(m => m.SelectVersionPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingPageModule)
  },
  {
    path: 'trip-report',
    loadChildren: () => import('./trip-report/trip-report.module').then( m => m.TripReportPageModule)
  },
  {
    path: 'favorite-locations',
    loadChildren: () => import('./favorite-locations/favorite-locations.module').then( m => m.FavoriteLocationsPageModule)
  },
  {
    path: 'driver-trip-report',
    loadChildren: () => import('./driver-trip-report/driver-trip-report.module').then( m => m.DriverTripReportPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
