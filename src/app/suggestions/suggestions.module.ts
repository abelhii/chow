import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestionsPage } from './suggestions.page';
import { SuggestionsPageRoutingModule } from './suggestions-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FilterModalPage } from './filter-modal/filter-modal/filter-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestionsPageRoutingModule,
    SharedModule
  ],
  declarations: [
    SuggestionsPage,
    FilterModalPage
  ],
  entryComponents: [FilterModalPage]
})
export class SuggestionsPageModule { }
