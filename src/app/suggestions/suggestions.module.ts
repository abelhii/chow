import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestionsPage } from './suggestions.page';
import { SuggestionsPageRoutingModule } from './suggestions-routing.module';
import { SuggestionDetailsComponent } from './suggestion-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestionsPageRoutingModule
  ],
  declarations: [
    SuggestionsPage,
    SuggestionDetailsComponent
  ]
})
export class SuggestionsPageModule {}
