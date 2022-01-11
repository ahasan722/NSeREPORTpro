import { FWDraftDataSubmitPage } from '../camp-draft-data-save/fw-draft-data-submit';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampDetailsPageRoutingModule } from './camp-submission-routing.module';
import { CampSubmissionPage } from './camp-submission.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CampDetailsPageRoutingModule
  ],
  declarations: [CampSubmissionPage,
    FWDraftDataSubmitPage
  ],
  entryComponents: [
    FWDraftDataSubmitPage
  ]
})
export class CampSubmissionPageModule {}
