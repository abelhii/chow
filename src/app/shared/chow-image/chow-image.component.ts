import { Component, Input, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'chow-image',
	templateUrl: './chow-image.component.html',
	styleUrls: ['./chow-image.component.scss'],
})
export class ChowImageComponent implements OnChanges {

	@Input() imgSource: string;
	@Input() logo: boolean = false;
	imgNotFound: boolean = false;

	constructor() { }

	ngOnChanges() {
		setTimeout(() => {
			if (this.logo && !this.imgSource) {
				this.imgSource = environment.unsplashChowUrl;
				return;
			}

			if (!this.imgSource || this.imgSource.length <= 0) {
				this.imgNotFound = true;
				this.imgSource = environment.unsplashChowUrl;
			} else {
				this.imgNotFound = false;
			}
		});
	}

	updateSrc() {
		setTimeout(() => {
			this.imgNotFound = true;
			this.imgSource = environment.unsplashChowUrl;
		});
	}

}
