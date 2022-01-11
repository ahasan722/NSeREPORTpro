import { UserData } from '../providers/user-data';
import { Facility } from '../interfaces/user-options';
import { StorageService } from '../service/stored-data/storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import { FWFinalData } from '../interfaces/fwfinal';
import { ApiClientService } from '../service/rest/api-interface.service';

@Component({
  selector: 'app-camp-final-data',
  templateUrl: './camp-final-data.page.html',
  styleUrls: ['./camp-final-data.page.scss'],
})
export class CampFinalDataPage implements OnInit {

  constructor(public userData:UserData ,public storageService:StorageService ,public route:ActivatedRoute,public apiClient:ApiClientService) {
    this.facilityID = this.route.snapshot.paramMap.get('facilityIndex');
    this.facility = this.userData.getUserLoginApiData()?.user.facilities[this.route.snapshot.paramMap.get('facilityIndex')];

  }

  finalDataList: FWFinalData[];
  facilityID:string;
  facility:Facility;


  async ngOnInit(): Promise<void> {
     const value =  await this.apiClient.loadFinalSubmissionDataByCamp();
     if(value?.success){
       this.finalDataList = value?.data;
     }

  }

}
