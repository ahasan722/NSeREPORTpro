import { StorageService } from './../service/stored-data/storage.service';
import { ApiClientService } from './../service/rest/api-interface.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UserLoginApiResponse, UserOptions } from '../interfaces/user-options';
import { UserData } from '../providers/user-data';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { useremail: '', password: '',rememberMe: true };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    public menu: MenuController,
    public apiClient: ApiClientService,
    public storageService:StorageService
    ) { }

  async onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
       const response: UserLoginApiResponse =  await this.apiClient.login(this.login);
       if(response?.success) {
        await this.userData.login(response.data);
        this.storageService.facilities = response.data.user.facilities;
        await this.router.navigateByUrl('/app/tabs/home', { replaceUrl: true });
       }
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }





}
