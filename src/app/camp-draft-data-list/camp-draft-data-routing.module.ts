import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampDraftDataPage } from './camp-draft-data.page';

const routes: Routes = [
  {
    path: '',
    component: CampDraftDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class CampDraftDataPageRoutingModule {}
