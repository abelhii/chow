import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class GoogleAPIService {

	apiKey: string = environment.googleApiKey;
	placePhotoURL: string = environment.placePhotoUrl;

	map: google.maps.Map;
	placesService: google.maps.places.PlacesService;

	nearbyPlaces: google.maps.places.PlaceResult[];

	constructor(private http: HttpClient) { }

	getPlacesByUserLatLng(lat: number, lng: number): Observable<any> {
		let userLocation = new google.maps.LatLng(lat, lng);

		let request: google.maps.places.PlaceSearchRequest = {
			location: userLocation,
			radius: 1000, // can't use radius with rankBy distance
			// rankBy: google.maps.places.RankBy.DISTANCE,
			type: 'restaurant',
		};

		if (this.placesService == null) {
			this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
			console.log('initialize places');
		}

		let dataSource = new BehaviorSubject<google.maps.places.PlaceResult[]>(null);
		let data = dataSource.asObservable();

		return new Observable<google.maps.places.PlaceResult[]>((observer) => {
			if (this.nearbyPlaces && this.nearbyPlaces.length > 0) {
				console.log("from local");
				observer.next(this.nearbyPlaces);
			}
			else {
				console.log("from api");
				this.placesService.nearbySearch(request, function (results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						dataSource.next(results);
						observer.next(results);
					}
				});

				data.subscribe(data => {
					this.nearbyPlaces = data;
				})
			}
		});
	}

	getPlaceDetailsByPlaceId(placeId: string): Observable<any> {
		let request: google.maps.places.PlaceDetailsRequest = {
			placeId: placeId,
			fields: [
				'place_id',
				'plus_code',
				'name',
				'address_component', 
				'adr_address', 
				'formatted_address', 
				'photo', 
				'icon',
				'type', 
				'url']
		}

		return new Observable<google.maps.places.PlaceResult>((observer) => {
			this.placesService.getDetails(request, function (place, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					observer.next(place);
				}
			});
		});
	}

	getPlacePhotoUrl(placePhotos: google.maps.places.PlacePhoto[], landscape: boolean): string{
		let photos = placePhotos;
		if(placePhotos && placePhotos.length > 1){
			photos = _.filter(placePhotos, x => { 
				return landscape ? x.width > x.height : x.width < x.height;
			});
		}

		return (photos && photos[0] != null) ? photos[0].getUrl({}) : "";
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
