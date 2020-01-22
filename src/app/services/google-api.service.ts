import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GoogleAPIService {

	apiKey: string = environment.googleApiKey;
	placePhotoURL: string = environment.placePhotoUrl;

	map: google.maps.Map;
	placesService: google.maps.places.PlacesService;

	nearbyPlaces: any;
	testString: string;

	constructor(private http: HttpClient) { }

	getPlacesByUserLatLng(lat: number, lng: number): Observable<any> {
		let userLocation = new google.maps.LatLng(lat, lng);

		let request = {
			location: userLocation,
			radius: 1000, // can't use radius with rankBy distance
			// rankBy: google.maps.places.RankBy.DISTANCE,
			type: 'restaurant',
		};

		if (this.placesService == null) {
			this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
			console.log('initialize places');
		}

		// TODO: Store list in local cache
		return new Observable<any>(observer => {
			if (this.nearbyPlaces && this.nearbyPlaces.length > 0) {
				observer.next(this.nearbyPlaces);
				console.log("from local");
			}
			else {
				console.log("from api");
				let testList = [];
				this.placesService.nearbySearch(request, function (results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						testList = results;
						observer.next(results);
					}
				});
				this.nearbyPlaces = testList;
			}
		});
	}

	getPlaces(): Observable<any> {
		return this.http.get("./assets/samplePlacesData.json");
	}

	getPhotoURLByReference(photo_ref: string) {
		let headers = {
			key: this.apiKey,
			photoreference: photo_ref,
			maxwidth: '500',
			maxheight: '500'
		};

		let url = this.placePhotoURL + new URLSearchParams(headers).toString();

		return url;
		// return this.http.get(url);
	}
}
