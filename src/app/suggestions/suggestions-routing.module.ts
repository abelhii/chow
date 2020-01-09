import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuggestionsPage } from './suggestions.page';
import { SuggestionDetailsComponent } from './suggestion-details.component';

const routes: Routes = [
  { path: '', component: SuggestionsPage },
  { path: 'details/:p1', component: SuggestionDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestionsPageRoutingModule { }
