import { UserData } from './user-data';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckTutorial implements CanLoad {
  constructor(private userData: UserData, private router: Router) {}



  async canLoad() {
    const res = await this.userData.isLoggedIn();
    if (res) {

      this.router.navigate(['/app', 'tabs', 'home']);
      return false;

    } else {
      return true;
    }
  }
}
