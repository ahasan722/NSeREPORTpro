import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampFinalDataPage } from './camp-final-data.page';

const routes: Routes = [
  {
    path: '',
    component: CampFinalDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampFinalDataPageRoutingModule {}
