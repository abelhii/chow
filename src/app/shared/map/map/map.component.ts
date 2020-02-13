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
		let target = { lat: position.lat(), lng: position.lng() };
		this.map = GoogleMaps.create('map_canvas', {
			controls: {
				zoom: false
			},
			camera: {
				target: target,
				zoom: 10
			}
		});
	}

	markLocation() {
		let position: google.maps.LatLng = this.place.geometry.location;
		let target = { lat: position.lat(), lng: position.lng() }

		this.map.clear();

		// Mark center position of camera
		this.map.animateCamera({
			target: target,
			zoom: 16
		});

		// add a marker
		let marker: Marker = this.map.addMarkerSync({
			title: this.place.name,
			snippet: this.place.rating.toString() + 'stars',
			position: target,
			animation: GoogleMapsAnimation.BOUNCE
		});

		// Set center position of camera to be above suggestions list
		this.map.fromLatLngToPoint(target).then((result) => {
			let point = result;
			point[1] += result[1] / 2;

			this.map.fromPointToLatLng(point).then((latLngResult) => {
				this.map.setCameraTarget(latLngResult);
			});
		})
	}
}