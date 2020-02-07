import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleAPIService } from '../services/google-api.service';
import { LoadingService } from '../services/loading.service';

@Component({
	selector: 'app-suggestions',
	templateUrl: './suggestions.page.html',
	styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {

	suggestionsList: google.maps.places.PlaceResult[] = [];
	randomPlace: google.maps.places.PlaceResult;

	slideOptions = {
		direction: 'horizontal',
		speed: 100
	};

	constructor(
		private _googleApiService: GoogleAPIService,
		private geolocation: Geolocation,
		private loading: LoadingService
	) { }

	ngOnInit() {
		this.geolocation.getCurrentPosition().then((resp) => {
			this.loading.present();
			this.getPlacesFromGoogle(resp);
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	getPlacesFromGoogle(resp) {
		this._googleApiService.getPlacesByUserLatLng(resp.coords.latitude, resp.coords.longitude)
			.subscribe((result: google.maps.places.PlaceResult[]) => {
				this.suggestionsList = result;
				this.getRandomPlace();
				this.loading.dismiss();
			});
	}

	getRandomPlace() {
		this.randomPlace = _.sample(this.suggestionsList);
	}

	getPlacePhotoUrl(placePhotos: google.maps.places.PlacePhoto[], landscape: boolean) {
		return this._googleApiService.getPlacePhotoUrl(placePhotos, landscape);
	}

	openInMaps(place: google.maps.places.PlaceResult) {
		this._googleApiService.openInMaps(place);
	}
}
