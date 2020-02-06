import { Component, Input, OnChanges } from '@angular/core';

@Component({
	selector: 'chow-image',
	templateUrl: './chow-image.component.html',
	styleUrls: ['./chow-image.component.scss'],
})
export class ChowImageComponent implements OnChanges {

	@Input() imgSource: string;
	@Input() height = "300px";
	@Input() logo: boolean = false;
	imgNotFound: boolean = false;

	constructor() { }

	ngOnChanges() {
		setTimeout(() => {
			if(this.logo && !this.imgSource){
				this.imgSource = "https://source.unsplash.com/collection/4927658/";
				return;
			}

			if (!this.imgSource || this.imgSource.length <= 0) {
				this.imgNotFound = true;
				this.imgSource = "https://source.unsplash.com/collection/4927658/";
			} else {
				this.imgNotFound = false;
			}
		});
	}

}
