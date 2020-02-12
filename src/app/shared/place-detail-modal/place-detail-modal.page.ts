import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { GoogleAPIService } from 'src/app/services/google-api.service';
import { PlaceStorageService } from 'src/app/services/place-storage.service';
import { LoadingToastService } from 'src/app/services/loading-toast.service';

@Component({
	selector: 'app-place-detail-modal',
	templateUrl: './place-detail-modal.page.html',
	styleUrls: ['./place-detail-modal.page.scss'],
})
export class PlaceDetailModalPage implements OnInit {
	@Input() place: google.maps.places.PlaceResult;

	placeDetails: google.maps.places.PlaceResult;
	favourite: boolean = false;

	constructor(
		public modalController: ModalController,
		private platform: Platform,
		private zone: NgZone,
		private placeStorage: PlaceStorageService,
		private loadingToast: LoadingToastService,
		private _googleApiService: GoogleAPIService,
	) {
		this.platform.backButton.subscribeWithPriority(0, () => {
			this.dismiss();
		})
	}

	ngOnInit() {
		this.checkIfFavourited();
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

	savePlace() {
		this.placeStorage.setPlace(this.place)
			.subscribe((result) => {
				this.favourite = result;
				if(result){
					this.loadingToast.presentToast("Saved to favourites!");
				}else {
					this.loadingToast.presentToast("Removed from your list");
				}
			});
	}

	dismiss() {
		this.modalController.dismiss();
	}

	checkIfFavourited() {
		console.log(this.favourite);
		this.placeStorage.getPlaceById(this.place.id).subscribe((result: number) => {
			if (result >= 0) {
				this.favourite = true;
			}
		})
	}
}
