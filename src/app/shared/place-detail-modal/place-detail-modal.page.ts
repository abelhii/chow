import { Component, OnInit, Input, HostListener, Sanitizer } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
	placePhotoUrl: string;
	favourite: boolean = false;
	
	constructor(
		private placeStorage: PlaceStorageService,
		private loadingToast: LoadingToastService,
		private _googleApiService: GoogleAPIService,
		public modalController: ModalController,
		public sanitizer: Sanitizer,
	) {
		// push modal state to history to prevent back button redirect
		if (!window.history.state.modal) {
			const modalState = { modal: true };
			history.pushState(modalState, null);
		}
	}

	ngOnInit() {
		this.checkIfFavourited();
	}

	getPlacePhotoUrl(landscape: boolean) {
		this.placePhotoUrl = this._googleApiService.getPlacePhotoUrl(this.place, landscape);
		return this.placePhotoUrl;
	}

	openInMaps() {
		this._googleApiService.openInMaps(this.place);
	}

	savePlace() {
		this.placeStorage.setPlace(this.place, this.placePhotoUrl)
			.subscribe((result) => {
				this.favourite = result;
				if(result){
					this.loadingToast.presentToast("Saved to favourites!");
				}else {
					this.loadingToast.presentToast("Removed from your list");
				}
			});
	}

	@HostListener('window:popstate', ['$event'])
	dismiss() {
		this.modalController.dismiss();
	}

	checkIfFavourited() {
		this.placeStorage.getPlaceById(this.place.id).subscribe((result: number) => {
			if (result >= 0) {
				this.favourite = true;
			}
		})
	}
}
