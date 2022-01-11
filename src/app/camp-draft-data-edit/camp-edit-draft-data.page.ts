import { LoaderService } from '../providers/loader.service';
import { StorageService } from '../service/stored-data/storage.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserData } from '../providers/user-data';
import { ApiClientService } from '../service/rest/api-interface.service';
import { FWLocalDraftData } from '../interfaces/fwlocalDB';

@Component({
  selector: 'app-camp-edit-draft-data',
  templateUrl: './camp-edit-draft-data.page.html',
  styleUrls: ['./camp-edit-draft-data.page.scss'],
})
export class CampEditDraftDataPage implements OnInit {

  fwLocalDraftData:FWLocalDraftData;
  @Input() index: number;
  @Input() facility_id: string;
  period:any;

  constructor(private userData: UserData,
    public apiClient: ApiClientService,
    public modalCtrl:ModalController,
    public storageService:StorageService,
    public ionLoader:LoaderService) {
  }


  async getFWLocalDraftDataByIndex(){

     //** Get draft data from local source */
     this.fwLocalDraftData =  await this.userData.getFacilityDraftDataFromStorageByIndex(this.facility_id,this.index);
     this.period = this.fwLocalDraftData.period.split('-').reverse().join('-');
     console.log(this.fwLocalDraftData);


  }

  async editLocalDraftDataItemByIndex(){
    if(this.fwLocalDraftData.remarks && this.period && this.fwLocalDraftData.activity_detail.female_value && this.fwLocalDraftData.activity_detail.male_value){

      this.fwLocalDraftData.updated_at = new Date();
      let date: Date = new Date(this.period);
      this.fwLocalDraftData.period = date.getMonth()+1 + '-' + date.getFullYear();
      this.fwLocalDraftData.synced = false;
      console.log(this.fwLocalDraftData);
      await this.userData.editFacilityLocalDraftDataItemByIndex(this.facility_id,this.index,this.fwLocalDraftData);
      this.ionLoader.presentToast('Edited Successfully.');
      this.dismiss(true);
    }
    else{
      this.ionLoader.presentToast('Provide the values.');
    }

  }



  ngOnInit() {
    this.getFWLocalDraftDataByIndex();

  }


  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }




}
