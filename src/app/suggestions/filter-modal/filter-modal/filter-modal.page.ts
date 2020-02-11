import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { PlaceType, PlaceFilter } from 'src/app/models/filters';

@Component({
	selector: 'filter-modal',
	templateUrl: './filter-modal.page.html',
	styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

	@Input() filter: PlaceFilter;

	// Enums
	PlaceType = PlaceType
	placeTypeOptions: string[];

	constructor(
		public modalController: ModalController,
		private platform: Platform
	) {
		this.platform.backButton.subscribeWithPriority(0, () => {
			this.dismiss(false);
		})
	}

	ngOnInit() {
		this.placeTypeOptions = Object.keys(PlaceType);
	}

	selectType(event: any) {
		this.filter.Type = PlaceType[event.detail.value] as PlaceType;
	}

	setRadius(event: any) {
		this.filter.Radius = event.detail.value;
	}

	dismiss(cancel: boolean) {
		if (cancel) {
			this.modalController.dismiss();
			return;
		}

		console.log(this.filter);
		this.modalController.dismiss(this.filter);
	}
}
