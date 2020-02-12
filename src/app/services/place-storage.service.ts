import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/internal/Observable';
import { Subscriber } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PlaceStorageService {

	constructor(private storage: Storage,) { }

	getPlaces(): Promise<any> {
		return this.storage.get("places");
	}

	getPlaceById(placeId: string) {
		let places: google.maps.places.PlaceResult[];
		return new Observable<number>((observer) => {
			this.getPlaces().then((result) => {
				places = JSON.parse(result) || [];
			}).finally(() => {
				observer.next(places.findIndex(x => x.id == placeId));
			})
		});
	}

	getPlacesList(): Observable<google.maps.places.PlaceResult[]> {
		return new Observable<google.maps.places.PlaceResult[]>((observer) => {
			this.getPlaces().then((result) => {
				observer.next(JSON.parse(result));
			});
		})
	}

	setPlace(place: google.maps.places.PlaceResult, photoUrl: string) {
		let placesList: google.maps.places.PlaceResult[];
		let isSaved: boolean = false;

		return new Observable<boolean>((observer) => {
			this.getPlaces().then((result) => {
				placesList = JSON.parse(result) || [];
				place.photoUrl = photoUrl;

				if (!placesList.find(x => x.id == place.id)) {
					placesList = placesList.concat(place);
					isSaved = true;
				} else {
					let placeIndex = placesList.findIndex(x => x.id == place.id);
					placesList.splice(placeIndex, 1);
					isSaved = false;
				}
			}).finally(() => {
				console.log(placesList);
				this.storage.set("places", JSON.stringify(placesList)).then(() => {
					observer.next(isSaved);
				});
			});
		})
	}
}
