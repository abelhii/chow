import { Component, OnInit, Input } from '@angular/core';
import { GoogleMap, GoogleMaps, Marker, GoogleMapsAnimation } from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';

@Component({
	selector: 'map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
	@Input() place: google.maps.places.PlaceResult;

	map: GoogleMap;

	constructor(private platform: Platform) { }

	async ngOnInit() {
		await this.platform.ready();
		await this.loadMap();
	}

	ngOnChanges() {
		setTimeout(() => {
			this.markLocation()
		});
	}

	loadMap() {
		let position: google.maps.LatLng = this.place.geometry.location;
		this.map = GoogleMaps.create('map_canvas', {
			camera: {
				target: {
					lat: position.lat(),
					lng: position.lng()
				},
				zoom: 10
			}
		});
	}

	markLocation() {
		let position: google.maps.LatLng = this.place.geometry.location;
		this.map.clear();

		// Move the map camera to the location with animation
		this.map.animateCamera({
			target: {
				lat: position.lat(),
				lng: position.lng()
			},
			zoom: 16
		});

		// add a marker
		let marker: Marker = this.map.addMarkerSync({
			title: this.place.name,
			snippet: this.place.rating.toString() + 'stars',
			position: {
				lat: position.lat(),
				lng: position.lng()
			},
			animation: GoogleMapsAnimation.BOUNCE
		});
	}
}
