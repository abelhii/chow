import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GoogleAPIService {

	apiKey: string = environment.googleApiKey;
	placePhotoURL: string = environment.placePhotoUrl;

	constructor(private http: HttpClient) { }

	getPlaces(): Observable<any> {
		return this.http.get("./assets/samplePlacesData.json");
	}

	getPhotoURLByReference(photo_ref: string){
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
