import { DraftDataComponentModule } from '../draft-data-component/draft-data.module';
import { PeriodDatePipe } from '../pipes/period-pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampDraftDataPageRoutingModule } from './camp-draft-data-routing.module';

import { CampDraftDataPage } from './camp-draft-data.page';
import { CampEditDraftDataPage } from '../camp-draft-data-edit/camp-edit-draft-data.page';
import { CampDraftdataFinalProcessPage } from '../camp-draftdata-grouped-final-upload/camp-draftdata-final-process.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DraftDataComponentModule,
    CampDraftDataPageRoutingModule
  ],
  exports:[CampDraftDataPage,CampEditDraftDataPage,CampDraftdataFinalProcessPage],
  declarations: [CampDraftDataPage,CampEditDraftDataPage,CampDraftdataFinalProcessPage]

})
export class CampDraftDataPageModule {}
