import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OfflineFormPageRoutingModule } from './offline-form-routing.module';

import { OfflineForm } from './offline-form.page';
import { SelectImageComponent } from '../shared/select-image/select-image.component';
import { ShowDataComponent } from './components/show-data/show-data.component';
import { RecordVoiceComponent } from '../shared/record-voice/record-voice.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OfflineFormPageRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [OfflineForm,SelectImageComponent,ShowDataComponent,RecordVoiceComponent],
})
export class TabsPageModule {}
