import { DraftDataComponent } from './draft-data.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [DraftDataComponent],
  exports: [DraftDataComponent]
})
export class DraftDataComponentModule {}
