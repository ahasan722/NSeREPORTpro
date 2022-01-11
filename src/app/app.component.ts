import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from './providers/user-data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  loggedIn = false;
  dark = false;

  constructor(
    private router: Router,
    private userData: UserData)
    {}

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
  }


  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
    window.addEventListener('user:mode_changed', () => {
      console.log(this.dark);
      this.updateMode();
    });
  }
  updateMode() {
    if(this.dark){
      this.dark = false;
    }
    else{
      this.dark = true;
    }
  }

  logout() {
    this.userData.logout().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

  openTutorial() {
    this.router.navigateByUrl('/tour');
  }



  public get getDark() {
    return this.dark;
  }
  public set setDark(value:boolean) {
    this.dark = value;
  }




}
