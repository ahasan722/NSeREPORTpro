import { Injectable, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService{


  loadingDialog: HTMLIonLoadingElement;
  loadingOptions: any = {
    animated: true,
    spinner: 'dots',
    translucent: true,
    backdropDismiss: true,
    keyboardClose: true,
    mode: 'ios',
  };
  isPresenting: boolean = false;
  loader: HTMLIonLoadingElement;

  constructor(
    public loadingController: LoadingController,public alertController:AlertController,public toastController: ToastController
  ) {

    this.inIt();

  }

  async inIt(){
  }




  // This will show then auto-hide the loader
  showHideAutoLoader() {

    this.loadingController.create({
      message: 'This Loader Will Auto Hide in 2 Seconds',
      duration: 2000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });

  }




  // Show the loader for infinite time
  async createLoader() {
     console.log('Loader available:'+ !(!this.loader));
     if(!this.loader){
      console.log('Creating loader:');
      this.loader = await this.loadingController.create(this.loadingOptions);
      this.loader.onDidDismiss().then((dis) => {
       this.isPresenting = false;
      });
     }
  }

// Show the loader for infinite time
async createAsyncLoader():Promise<HTMLIonLoadingElement> {
   console.log('Creating loader:');
   return this.loadingController.create(this.loadingOptions);

}






  async showLoader() {
    console.log('Presenting loader:');
    await this.loader.present();

  }



  // Hide the loader if already created otherwise return error
  async hideLoader() {
    if (this.isPresenting && this.loader) {
       console.log('loader dismissing');
       await this.loader.dismiss();
      this.isPresenting = false;
    }

  }




  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

  async presentToastWithOptions(title: string, msg: string) {
    const toast = await this.toastController.create({
      header: title,
      message: msg,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  async presentAlertConfirm(title:any,message:any) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
         {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirmCallback(title:any,message:any,callback) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
         {
          text: 'OK',
          handler: () => {
            callback('OK')
          }
        }
      ]
    });

    await alert.present();
  }



}
