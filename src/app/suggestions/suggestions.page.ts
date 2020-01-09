import { Component, OnInit } from '@angular/core';
import { GoogleAPIService } from '../services/google-api.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
	selector: 'app-suggestions',
	templateUrl: './suggestions.page.html',
	styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {

	suggestionsList: any[] = [];

	constructor(
		private _googleApiService: GoogleAPIService,
		private router: Router
	) { }

	ngOnInit() {
		this._googleApiService.getPlaces().subscribe(places => {
			console.log(places);
			this.suggestionsList = this.getPlacePhotoURL(places.results);
		});
	}

	getPlacePhotoURL(placesList: any[]) {
		_.forEach(placesList, (x, index) => {
			let photo_ref = x.photos[0].photo_reference;
			placesList[index].photoURL = this._googleApiService.getPhotoURLByReference(photo_ref);
				// .subscribe(result => {
				// 	console.log('photoURL: ', result);
				// 	placesList[index].photoURL = result;
				// 	console.log(placesList);
				// });
		});

		return placesList;
	}

}
