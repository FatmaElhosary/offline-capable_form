import { Injectable, Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async displayAlert(message: string, header = 'Error') {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      position: 'top',
      duration: 3000,
      animated: true,
    });
    await toast.present();
  }
  loading: any;
  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      showBackdrop: true,
    });
    await this.loading.present();
  }

  async dismissLoading() {
	this.loadingController.dismiss();
  }


  convertFileToBase64(file: Blob, callback: (base64: string) => void): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      callback(reader.result as string);
    };
  }
}
