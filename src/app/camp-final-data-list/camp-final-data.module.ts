import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampFinalDataPageRoutingModule } from './camp-final-data-routing.module';

import { CampFinalDataPage } from './camp-final-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampFinalDataPageRoutingModule
  ],
  declarations: [CampFinalDataPage]
})
export class CampFinalDataPageModule {}
