import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleAPIService } from 'src/app/services/google-api.service';

@Component({
	selector: 'app-suggestion-details',
	templateUrl: './suggestion-details.component.html',
	styleUrls: ['./suggestion-details.component.scss'],
})
export class SuggestionDetailsComponent implements OnInit {

	photoURL: string;

	constructor(
		private route: ActivatedRoute,
		private _googleApiService: GoogleAPIService
		) { }

	ngOnInit() {
		console.log('work damnit');
		let photoReference = this.route.snapshot.params['p1'];

		this.photoURL = this._googleApiService.getPhotoURLByReference(photoReference)
		// .subscribe(result => {
		// 	console.log(result);
		// 	this.photoURL = result;
		// });
	}

}
