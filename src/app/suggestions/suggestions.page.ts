import { Component, OnInit, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as _ from 'lodash';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { GoogleAPIService } from '../services/google-api.service';
import { PlaceFilter, PlaceType } from '../models/filters';
import { IonSlides } from '@ionic/angular';
import { ModalService } from '../services/modal.service';
import { LoadingToastService } from '../services/loading-toast.service';

@Component({
	selector: 'app-suggestions',
	templateUrl: './suggestions.page.html',
	styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {
	@ViewChild('suggestionSection', { static: false }) suggestionSection: ElementRef;
	@ViewChild('suggestionSlides', { static: false }) slider: IonSlides;

	suggestionsList: google.maps.places.PlaceResult[] = [];
	selectedPlace: google.maps.places.PlaceResult;
	suggestionsOffsetTop: number;

	isEven: boolean = false;
	randomEmoji: string;
	marginTopForSuggestionSection: string;

	currentPosition: Geoposition;
	filter: PlaceFilter = {
		Type: PlaceType.Restaurant,
		Radius: 2500
	};

	slideOptions = {
		direction: 'horizontal',
		speed: 300,
		freeMode: true
	};

	constructor(
		private _googleApiService: GoogleAPIService,
		private geolocation: Geolocation,
		private zone: NgZone,
		private loadingToast: LoadingToastService,
		public modalService: ModalService
	) { }

	ngOnInit() {
		this.geolocation.getCurrentPosition().then((resp) => {
			this.currentPosition = resp;
			this.getPlacesFromGoogle();
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	getPlacesFromGoogle() {
		this._googleApiService
			.getPlacesByUserLatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude, this.filter)
			.subscribe((result: google.maps.places.PlaceResult[]) => {
				this.zone.run(() => {
					this.suggestionsList = result;
				})
				setTimeout(() => {
					this.getRandomPlace();
					this.adjustMarginTop();
				})
			});
	}

	getRandomPlace() {
		this.selectedPlace = _.sample(this.suggestionsList);
		this.slider.slideTo(this.suggestionsList.indexOf(this.selectedPlace), 600);

		this.getRandomEmoji();
	}

	getPlacePhotoUrl(place: google.maps.places.PlaceResult, landscape: boolean) {
		return this._googleApiService.getPlacePhotoUrl(place, landscape);
	}

	openInMaps(place: google.maps.places.PlaceResult) {
		this._googleApiService.openInMaps(place);
	}

	changeSelectedPlace() {
		this.slider.getActiveIndex()
			.then(index => {
				this.isEven = index % 2 == 0;
				this.selectedPlace = this.suggestionsList[index];

				this.getRandomEmoji();
			});
	}

	getRandomEmoji() {
		this.randomEmoji = this.loadingToast.getRandomFoodEmoji();
	}

	// Place detail modal
	presentPlaceModal(place: google.maps.places.PlaceResult) {
		this.modalService.presentPlaceModal(place);
	}

	// Filter
	presentFilterModal() {
		this.modalService.presentFilterModal(this.filter).then((observable) => {
			observable.subscribe((filterResults) => {
				this.filter = filterResults;
				this.getPlacesFromGoogle();
			})
		})
	}

	@HostListener('window:resize', [])
	adjustMarginTop() {
		setTimeout(() => {
			let deviceHeight = this.suggestionSection.nativeElement.offsetParent.offsetHeight;
			let suggestionsSectionHeight = this.suggestionSection.nativeElement.offsetHeight;

			this.marginTopForSuggestionSection = (deviceHeight - suggestionsSectionHeight) + 'px';
		}, 400);
	}	
}
