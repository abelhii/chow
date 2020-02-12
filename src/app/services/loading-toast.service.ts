import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class LoadingToastService {

	isLoading = false;

	constructor(
		public loadingController: LoadingController,
		public toastController: ToastController
	) { }

	getRandomFoodEmoji(): string {
		let min = 127812;
		let max = 127871;
		let rand = Math.floor(Math.random() * (max - min)) + min;

		return '&#' + rand + ';';
	}

	async present() {
		this.isLoading = true;
		return await this.loadingController.create({
			duration: 5000,
		}).then(a => {
			a.present().then(() => {
				console.log('presented');
				if (!this.isLoading) {
					a.dismiss().then(() => console.log('abort presenting'));
				}
			});
		});
	}

	async dismiss() {
		this.isLoading = false;
		// ERROR: overlay does not exist
		return await this.loadingController.dismiss().then(() => console.log('dismissed'));
	}

	async presentToast(message: string, duration?: number) {
		const toast = await this.toastController.create({
			message: message,
			duration: duration || 1000
		});
		toast.present();
	}
}
