import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { NominatimAPIService } from '../services/nominatim-api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SearchPlace } from '../models/nominatim';
import { GoogleAPIService } from '../services/google-api.service';

@Component({
	selector: 'app-suggestions',
	templateUrl: './suggestions.page.html',
	styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {

	suggestionsList: google.maps.places.PlaceResult[] = [];
	randomPlace: google.maps.places.PlaceResult;
	suggestionsNominatimList: SearchPlace[] = [];
	randomNominatimPlace: SearchPlace;

	slideOptions = {
		direction: 'horizontal',
		speed: 100
	};

	constructor(
		private _googleApiService: GoogleAPIService,
		private _nominatimApiService: NominatimAPIService,
		private geolocation: Geolocation
	) { }

	ngOnInit() {
		this.geolocation.getCurrentPosition().then((resp) => {
			// this.getPlacesFromNominatim(resp);
			this.getPlacesFromGoogle(resp);
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	getPlacesFromGoogle(resp) {
		this._googleApiService.getPlacesByUserLatLng(resp.coords.latitude, resp.coords.longitude)
			.subscribe((result: google.maps.places.PlaceResult[]) => {
				console.log('google', result);
				this.suggestionsList = result;
				this.getRandomPlace();
			});
	}

	getRandomPlace() {
		this.randomPlace = _.sample(this.suggestionsList);
	}

	getPlacesFromNominatim(resp) {
		this._nominatimApiService.getPlacesByLatLng(resp.coords.latitude, resp.coords.longitude)
			.subscribe((result: SearchPlace[]) => {
				console.log('nominatim', result);

				let randNum = Math.round(Math.random() * result.length);
				this.suggestionsNominatimList = result;
				this.randomNominatimPlace = result[randNum];
			});
	}

	// getPlacePhotoURL(placesList: any[]) {
	// 	_.forEach(placesList, (x, index) => {
	// 		let photo_ref = x.photos[0].photo_reference;
	// 		placesList[index].photoURL = this._googleApiService.getPhotoURLByReference(photo_ref);
	// 		// .subscribe(result => {
	// 		// 	console.log('photoURL: ', result);
	// 		// 	placesList[index].photoURL = result;
	// 		// 	console.log(placesList);
	// 		// });
	// 	});

	// 	return placesList;
	// }

}
