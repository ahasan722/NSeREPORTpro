import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampSubmissionPage } from './camp-submission.page';


const routes: Routes = [
  {
    path: '',
    component: CampSubmissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampDetailsPageRoutingModule {}
