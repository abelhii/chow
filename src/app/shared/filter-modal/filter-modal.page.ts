import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
		public modalController: ModalController
	) {
		// push modal state to history to prevent back button redirect
		if (!window.history.state.modal) {
			const modalState = { modal: true };
			history.pushState(modalState, null);
		}
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

	@HostListener('window:popstate', ['$event'])
	dismiss(cancel: boolean) {
		if (cancel) {
			this.modalController.dismiss();
			return;
		}
		
		this.modalController.dismiss(this.filter);
	}
}
