import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

	homeFyi: string[] = [];
	fyi: string;

	constructor(private http: HttpClient) {
		if(this.homeFyi.length <= 0){
			this.getMiscText().subscribe((result) => {
				this.homeFyi = result.homeFYI;
				this.fyi = _.sample(result.homeFYI);
			});
		}
	}

	ngOnInit() {
		this.fyi = _.sample(this.homeFyi);
	}

	getMiscText(): Observable<any> {
		return this.http.get("../assets/miscText.json");
	}
}
