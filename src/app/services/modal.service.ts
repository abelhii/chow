import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlaceFilter } from '../models/filters';
import { Observable } from 'rxjs';
import { PlaceDetailModalPage } from '../shared/place-detail-modal/place-detail-modal.page';
import { FilterModalPage } from '../shared/filter-modal/filter-modal.page';
import { Router, Event, NavigationStart } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ModalService {

	constructor(
		public modalController: ModalController,
		private router: Router
	) {
		this.router.events.subscribe((event: Event): void => {
			if (event instanceof NavigationStart) {
				if (event.navigationTrigger === "popstate") {
					this.closeModals();
				}
			}
		})
	}

	// Close all modals
	async closeModals() {
		try {
			const element = await this.modalController.getTop();
			if (element) {
				element.dismiss();
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Place detail modal
	async presentPlaceModal(place: google.maps.places.PlaceResult) {
		const modal = await this.modalController.create({
			component: PlaceDetailModalPage,
			componentProps: { place: place }
		});

		await modal.present();

		return new Observable((observer) => {
			modal.onDidDismiss().then((result) => {
				observer.next(null);
			});
		})
	}

	// Filter
	async presentFilterModal(filter: PlaceFilter) {
		const modal = await this.modalController.create({
			component: FilterModalPage,
			componentProps: { filter: filter }
		});

		await modal.present();

		return new Observable((observer) => {
			modal.onDidDismiss().then((result) => {
				if (result.data) {
					observer.next(result.data);
				}
			});
		})
	}
}
