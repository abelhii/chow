import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReversePlace } from '../models/nominatim';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class NominatimAPIService {

	nominatimSearchURL: string = environment.nominatimSearchURL;
	nominatimReverseURL: string = environment.nominatimReverseURL;

	constructor(
		private http: HttpClient
	) { }

	getUserAddress(latitude, longitude) {
		let headers = {
			lat: latitude,
			lon: longitude,
			zoom: '10',
			format: 'json'
		};

		let url = this.nominatimReverseURL + new URLSearchParams(headers).toString();

		return this.http.get(url);
	}

	getPlacesByLatLng(latitude, longitude) {
		return this.getUserAddress(latitude, longitude).pipe(
			mergeMap((place: ReversePlace) => {
				let headers = {
					q: place.display_name + ',food',
					addressdetails: '1',
					format: 'geocodejson'
				};

				let url = this.nominatimSearchURL + new URLSearchParams(headers).toString();

				return this.http.get(url);
			})
		);
	}


}
