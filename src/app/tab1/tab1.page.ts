import { ApiClientService } from './../service/rest/api-interface.service';
import { UserData } from 'src/app/providers/user-data';
import { Component, OnInit } from '@angular/core';
import { Facility } from '../interfaces/user-options';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{


  facilities: Facility[];


  constructor(private userData:UserData,
    public apiClient:ApiClientService) {}

  ngOnInit(): void {
    //Called after the constructor,
    //initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.]
    this.loadFacilities();
    this.loadActivities();
  }


    async loadActivities(){
      await this.apiClient.loadActivitiesAndDetails();
    }

    async loadFacilities(){
      this.facilities = (await this.apiClient.getFacilities(this.userData.getUserLoginApiData()?.user.id)).data.facilities;
    }





}
