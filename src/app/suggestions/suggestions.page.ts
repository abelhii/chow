import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { GoogleAPIService } from '../services/google-api.service';
import { PlaceFilter, PlaceType } from '../models/filters';
import { IonSlides, ModalController } from '@ionic/angular';
import { FilterModalPage } from './filter-modal/filter-modal/filter-modal.page';

@Component({
	selector: 'app-suggestions',
	templateUrl: './suggestions.page.html',
	styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {
	@ViewChild('suggestionSlides', { static: false }) slider: IonSlides;

	suggestionsList: google.maps.places.PlaceResult[] = [];
	selectedPlace: google.maps.places.PlaceResult;
	isEven: boolean = false;
	randomEmoji: string;

	currentPosition: Geoposition;
	filter: PlaceFilter = {
		Type: PlaceType.Restaurant,
		Radius: 1000,
		OpenNow: false
	};

	slideOptions = {
		direction: 'horizontal',
		speed: 300,
		freeMode: true
	};

	constructor(
		private _googleApiService: GoogleAPIService,
		private geolocation: Geolocation,
		private zone: NgZone,
		public modalController: ModalController
	) { }

	ngOnInit() {
		this.geolocation.getCurrentPosition().then((resp) => {
			this.currentPosition = resp;
			this.getPlacesFromGoogle();
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	getPlacesFromGoogle() {
		this._googleApiService
			.getPlacesByUserLatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude, this.filter)
			.subscribe((result: google.maps.places.PlaceResult[]) => {
				this.zone.run(() => {
					this.suggestionsList = result;
				})
				setTimeout(() => {
					this.getRandomPlace();
				})
			});
	}

	getRandomPlace() {
		this.selectedPlace = _.sample(this.suggestionsList);
		this.slider.slideTo(this.suggestionsList.indexOf(this.selectedPlace), 300);
		
		this.getRandomEmoji();
	}

	getPlacePhotoUrl(placePhotos: google.maps.places.PlacePhoto[], landscape: boolean) {
		return this._googleApiService.getPlacePhotoUrl(placePhotos, landscape);
	}

	openInMaps(place: google.maps.places.PlaceResult) {
		this._googleApiService.openInMaps(place);
	}

	changeSelectedPlace() {
		this.slider.getActiveIndex()
			.then(index => {
				this.isEven = index % 2 == 0;
				this.selectedPlace = this.suggestionsList[index];

				this.getRandomEmoji();
			});
	}

	getRandomEmoji() {
		let min = 127812;
		let max = 127871;
		let rand = Math.floor(Math.random() * (max - min)) + min;

		this.randomEmoji = '&#' + rand + ';';
	}

	// Filter
	async presentModal() {
		const modal = await this.modalController.create({
			component: FilterModalPage,
			componentProps: { filter: this.filter }
		});

		modal.onDidDismiss().then((result) => {
			if (result.data) {
				this.filter = result.data;
				this.getPlacesFromGoogle();
			}
		});

		await modal.present();
	}
}
