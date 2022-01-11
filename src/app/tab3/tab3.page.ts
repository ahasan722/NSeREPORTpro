import { AppComponent } from './../app.component';
import { UserData } from 'src/app/providers/user-data';
import { Component, OnInit } from '@angular/core';
import {  UserLoginData } from '../interfaces/user-options';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{


  userLoginData: UserLoginData;
  loggedIn:boolean = false;
  dark:boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData
  ) { }
  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getUserLoginData();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.getUserLoginData();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.userLoginData.email,
          placeholder: 'username'
        }
      ]
    });
    await alert.present();
  }

  getUserLoginData() {
    console.log(this.userData.getUserLoginApiData());
    this.userLoginData = this.userData.getUserLoginApiData().user;
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  async logout() {
    this.userData.logout().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });

  }


  support() {
    this.router.navigateByUrl('/support');
  }

  openTutorial() {
    this.router.navigateByUrl('/tour');
  }

  changedMode(){
    window.dispatchEvent(new CustomEvent('user:mode_changed'));
  }





}
