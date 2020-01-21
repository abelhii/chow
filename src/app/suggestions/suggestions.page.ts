import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { NominatimAPIService } from '../services/nominatim-api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FeatureCollection, PropertyGeocoding } from '../models/nominatim';

@Component({
	selector: 'app-suggestions',
	templateUrl: './suggestions.page.html',
	styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {

	suggestionsList: any[] = [];

	constructor(
		private _nominatimApiService: NominatimAPIService,
		private geolocation: Geolocation,
		private router: Router
	) { }

	ngOnInit() {
		this.geolocation.getCurrentPosition().then((resp) => {
			this._nominatimApiService.getPlacesByLatLng(resp.coords.latitude, resp.coords.longitude)
				.subscribe((result: FeatureCollection) => {
					this.suggestionsList = _.map(result.features, x => { return x.properties.geocoding });
					console.log(this.suggestionsList);
				});
		}).catch((error) => {
			console.log('Error getting location', error);
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
