import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChowImageComponent } from './chow-image/chow-image.component';
import { MapComponent } from './map/map/map.component';
import { IonicModule } from '@ionic/angular';
import { PlaceDetailModalPage } from './place-detail-modal/place-detail-modal.page';
import { FilterModalPage } from './filter-modal/filter-modal.page';
import { ModalService } from '../services/modal.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		ChowImageComponent,
		MapComponent,
		PlaceDetailModalPage,
		FilterModalPage
	],
	exports: [
		ChowImageComponent,
		MapComponent
	],
	entryComponents: [
		PlaceDetailModalPage,
		FilterModalPage
	],
	providers: [
		ModalService
	]
})
export class SharedModule { }
