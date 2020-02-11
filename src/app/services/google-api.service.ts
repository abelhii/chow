import { Injectable, Input, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { Platform } from '@ionic/angular';
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
		private http: HttpClient,
		private platform: Platform
	) { }

	getPlacesByUserLatLng(lat: number, lng: number, filter: PlaceFilter): Observable<any> {
		let userLocation = new google.maps.LatLng(lat, lng);

		let request: google.maps.places.PlaceSearchRequest = {
			location: userLocation,
			radius: filter.Radius || 1000,
			keyword: filter.Type || PlaceType.Restaurant,
			openNow: filter.OpenNow,
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
				if (this.placesService == null) {
					// Initialise places service
					this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
				}

				this.prevPlaceRequest = request;
				this.placesService.nearbySearch(request, function (results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						console.log(results);
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

	getPlacePhotoUrl(placePhotos: google.maps.places.PlacePhoto[], landscape: boolean): string {
		let photos = placePhotos;

		// prioritize getting landscape photos
		if (placePhotos && placePhotos.length > 1) {
			photos = _.filter(placePhotos, x => {
				return landscape ? x.width > x.height : x.width < x.height;
			});
		}

		if (photos && photos[0] != null) {
			return _.sample(photos).getUrl({ maxHeight: 500, maxWidth: 500 });
		} else {
			return null;
		}
	}

	openInMaps(place: google.maps.places.PlaceResult) {
		let destination = place.geometry.location.lat() + "," + place.geometry.location.lng();
		window.open(environment.googleMapsUrl + destination + "&query_place_id=" + place.place_id);
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
