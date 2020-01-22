import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { NominatimAPIService } from '../services/nominatim-api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FeatureCollection, PropertyGeocoding, SearchPlace } from '../models/nominatim';
import { GoogleAPIService } from '../services/google-api.service';

@Component({
	selector: 'app-suggestions',
	templateUrl: './suggestions.page.html',
	styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {

	suggestionsList: any[] = [];
	suggestionsNominatimList: SearchPlace[] = [];
	randomPlace: SearchPlace;

	constructor(
		private _googleApiService: GoogleAPIService,
		private _nominatimApiService: NominatimAPIService,
		private geolocation: Geolocation,
		private router: Router
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
		console.log(resp);
		this._googleApiService.getPlacesByUserLatLng(resp.coords.latitude, resp.coords.longitude)
			.subscribe(result => {
				console.log('result', result);
				this.suggestionsList = result;
			});
	}

	getPlacesFromNominatim(resp) {
		this._nominatimApiService.getPlacesByLatLng(resp.coords.latitude, resp.coords.longitude)
			.subscribe((result: SearchPlace[]) => {
				console.log(result);

				let randNum = Math.round(Math.random() * result.length);
				this.suggestionsList = result;
				this.randomPlace = result[randNum];
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
