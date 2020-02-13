import { Component, OnInit } from '@angular/core';
import { PlaceStorageService } from '../services/place-storage.service';
import { ModalService } from '../services/modal.service';
import { LoadingToastService } from '../services/loading-toast.service';

@Component({
	selector: 'app-favourites',
	templateUrl: './favourites.page.html',
	styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

	places: google.maps.places.PlaceResult[];

	constructor(
		private placesStorage: PlaceStorageService,
		private loadingToast: LoadingToastService,
		public modalService: ModalService
	) { }

	ngOnInit() {
		this.getPlaces();
	}

	getPlaces() {
		this.placesStorage.getPlaces().then((result) => {
			this.places = JSON.parse(result);
		});
	}

	presentPlaceModal(place: google.maps.places.PlaceResult) {
		this.modalService.presentPlaceModal(place).then((observable) => {
			observable.subscribe(() => {
				this.getPlaces();
			})
		});
	}

	getRandomEmoji() {
		return this.loadingToast.getRandomFoodEmoji();
	}
}
