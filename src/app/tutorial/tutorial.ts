import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, IonSlides } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { UserData } from '../providers/user-data';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage {
  showSkip = true;
  loggedIn: boolean;


  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    public router: Router,
    public storage: Storage,
    private userData: UserData
  ) {}

  async ngOnInit() {
    this.checkLoginStatus();
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


  async startApp() {
    await this.userData.checkDidSeenTutorial(true);
    if(!this.loggedIn){
      this.router
      .navigateByUrl('/login', { replaceUrl: true });
    }
    else{
      this.router.navigateByUrl('/app/tabs/home', { replaceUrl: true });
    }
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }


}
