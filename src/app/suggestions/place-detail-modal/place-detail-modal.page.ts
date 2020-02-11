import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { GoogleAPIService } from 'src/app/services/google-api.service';

@Component({
	selector: 'app-place-detail-modal',
	templateUrl: './place-detail-modal.page.html',
	styleUrls: ['./place-detail-modal.page.scss'],
})
export class PlaceDetailModalPage implements OnInit {
	@Input() place: google.maps.places.PlaceResult;

	placeDetails: google.maps.places.PlaceResult;

	constructor(
		public modalController: ModalController,
		private platform: Platform,
		private zone: NgZone,
		private _googleApiService: GoogleAPIService
	) {
		this.platform.backButton.subscribeWithPriority(0, () => {
			this.dismiss();
		})
	}

	ngOnInit() {
		this._googleApiService.getPlaceDetailsByPlaceId(this.place.id)
			.subscribe((result: google.maps.places.PlaceResult) => {
				this.zone.run(() => {
					this.placeDetails = result;
					console.log(this.placeDetails);
				})
			});
	}

	getPlacePhotoUrl(placePhotos: google.maps.places.PlacePhoto[], landscape: boolean) {
		return this._googleApiService.getPlacePhotoUrl(placePhotos, landscape);
	}

	openInMaps() {
		this._googleApiService.openInMaps(this.place);
	}

	dismiss() {
		this.modalController.dismiss();
	}
}
