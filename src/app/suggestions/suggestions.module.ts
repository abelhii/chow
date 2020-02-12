import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SuggestionsPage } from './suggestions.page';
import { SuggestionsPageRoutingModule } from './suggestions-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SuggestionsPageRoutingModule,
  ],
  declarations: [
    SuggestionsPage
  ]
})
export class SuggestionsPageModule { }
