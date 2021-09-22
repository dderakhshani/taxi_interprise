import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectVersionPageRoutingModule } from './select-version-routing.module';

import { SelectVersionPage } from './select-version.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectVersionPageRoutingModule
  ],
  declarations: [SelectVersionPage]
})
export class SelectVersionPageModule {}
