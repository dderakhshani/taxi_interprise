import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectVersionPage } from './select-version.page';

const routes: Routes = [
  {
    path: '',
    component: SelectVersionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectVersionPageRoutingModule {}
