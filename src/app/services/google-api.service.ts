import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { PlaceFilter, PlaceType } from '../models/filters';

@Injectable({
	providedIn: 'root'
})
export class GoogleAPIService {
	apiKey: string = environment.googleApiKey;
	placePhotoURL: string = environment.placePhotoUrl;

	map: google.maps.Map;
	placesService: google.maps.places.PlacesService;
	nearbyPlaces: google.maps.places.PlaceResult[];

	private dataSource = new BehaviorSubject<google.maps.places.PlaceResult[]>(null);
	data = this.dataSource.asObservable();

	prevPlaceRequest: google.maps.places.PlaceSearchRequest;
	filterChanged: boolean = false;

	constructor(
		private http: HttpClient
	) { }

	getPlacesByUserLatLng(lat: number, lng: number, filter: PlaceFilter): Observable<any> {
		let userLocation = new google.maps.LatLng(lat, lng);

		let request: google.maps.places.PlaceSearchRequest = {
			location: userLocation,
			radius: filter.Radius || 2500,
			keyword: filter.Type || PlaceType.Restaurant,
			type: 'food'
		};

		this.filterChanged = JSON.stringify(this.prevPlaceRequest) !== JSON.stringify(request);
		let dataSourceLocal = this.dataSource;

		return new Observable<google.maps.places.PlaceResult[]>((observer) => {
			if (this.nearbyPlaces && this.nearbyPlaces.length > 0 && !this.filterChanged) {
				// get from local
				observer.next(this.nearbyPlaces);
			}
			else {
				// get from api
				this.initialisePlaceService();
				this.prevPlaceRequest = request;
				this.placesService.nearbySearch(request, function (results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						dataSourceLocal.next(results);
						observer.next(results);
					} else {
						observer.error(results);
					}
				});

				this.data.subscribe(data => {
					this.nearbyPlaces = data;
				});
			}
		});
	}

	getPlacePhotoUrl(place: google.maps.places.PlaceResult, landscape: boolean): string {
		let photos = place.photos;

		// prioritize getting landscape photos
		if (photos && photos.length > 1) {
			photos = _.filter(photos, x => {
				return landscape ? x.width > x.height : x.width < x.height;
			});
		}

		if (photos && photos[0] != null) {
			let chosenPhoto = _.sample(photos);
			if (place.photoUrl) {
				return place.photoUrl;
			}
			if (typeof chosenPhoto.getUrl === "function") {
				return chosenPhoto.getUrl({ maxHeight: 500, maxWidth: 500 });
			}
		} else {
			return null;
		}
	}

	openInMaps(place: google.maps.places.PlaceResult) {
		let location = place.geometry.location;
		let destination = "";
		if (typeof location.lat === "function") {
			destination = place.geometry.location.lat() + "," + place.geometry.location.lng();
		} else {
			destination = place.geometry.location.lat + "," + place.geometry.location.lng;
		}
		window.open(environment.googleMapsUrl + destination + "&query_place_id=" + place.place_id);
	}

	initialisePlaceService() {
		if (this.placesService == null) {
			// Initialise places service
			this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
		}
	}

	// May come in handy //

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
		this.initialisePlaceService();
		return new Observable<google.maps.places.PlaceResult>((observer) => {
			this.placesService.getDetails(request, function (place, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					observer.next(place);
				}
			});
		});
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

	getSamplePlaces(): Observable<any> {
		return this.http.get("./assets/samplePlacesData.json");
	}
}
