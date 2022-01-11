import { UserData } from 'src/app/providers/user-data';
import { LoaderService } from '../providers/loader.service';
import { StorageService } from '../service/stored-data/storage.service';
import { ApiClientService } from '../service/rest/api-interface.service';
import { Component, Input, OnInit } from '@angular/core';
import { GroupedActivityDetailsData } from '../interfaces/fwdata';
import {  AlertController, ModalController } from '@ionic/angular';
import { FWLocalDraftData } from '../interfaces/fwlocalDB';

@Component({
  selector: 'app-camp-draftdata-final-process',
  templateUrl: './camp-draftdata-final-process.page.html',
  styleUrls: ['./camp-draftdata-final-process.page.scss'],
})
export class CampDraftdataFinalProcessPage implements OnInit {


  groupedActivityDetailsData: GroupedActivityDetailsData[] = [];
  @Input() facilityId: any;
  @Input() period: string;
  fwLocalDraftData: FWLocalDraftData[];
  allData:FWLocalDraftData[];



  constructor(public alertController: AlertController,
    public storageService: StorageService,
    public apiClient: ApiClientService,
    private ionLoader: LoaderService,
    private userData: UserData,
    public modalCtrl:ModalController) {

  }

  ngOnInit() {
    this.loadDataGroupedByActivities();
  }

  async loadDataGroupedByActivities() {
    //** Loading from remote source */
    //const value = await this.apiClient.loadFWDraftDataGroupedActivityWiseByFacilityIdForFinalSubmission(this.period,this.facilityId);
    //this.groupedActivityDetailsData = value.data.data;

    this.allData = await this.userData.getDraftDataFromStorageByFacility(this.facilityId);
    this.fwLocalDraftData = this.allData
      .filter((value: FWLocalDraftData, index: Number, array: FWLocalDraftData[]) => {
        if (value.period == this.period) {
          return value;
        }
      });


    // Group Detail Activities //
    for (var i = 0; i < this.fwLocalDraftData.length; i++) {
       var found = false;
       for(var j = 0; j < this.groupedActivityDetailsData.length; j++){
         if(this.groupedActivityDetailsData[j].activity_detail_id == this.fwLocalDraftData[i].activity_detail.id){
             found = true;
             this.groupedActivityDetailsData[j].reached_female +=  this.fwLocalDraftData[i].activity_detail.female_value;
             this.groupedActivityDetailsData[j].reached_male +=  this.fwLocalDraftData[i].activity_detail.male_value;
         }
       }
       if(!found){
         let item = new GroupedActivityDetailsData(this.fwLocalDraftData[i].activity_detail.name,this.fwLocalDraftData[i].activity_detail.id,this.fwLocalDraftData[i].period,this.storageService.getActivityName(this.fwLocalDraftData[i].activity_detail.activity_id),this.fwLocalDraftData[i].activity_detail.activity_id,this.fwLocalDraftData[i].activity_detail.female_value,this.fwLocalDraftData[i].activity_detail.male_value);
         this.groupedActivityDetailsData.push(item);
       }
    }

  }

  async onSubmit() {
    const value = await this.apiClient.uploadFWDraftDataFinalStore(this.facilityId, this.period, this.groupedActivityDetailsData);
    if(value.success){
      await this.userData.deleteFacilityLocalDraftDataByPeriod(this.facilityId,this.period);
    }
    this.ionLoader.presentToast(value.message);
    this.dismiss(true);
   }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'On final submission all of your draft data of '+this.period+' period will be deleted automatically.',
      buttons: [
        {
          text: 'wait',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Proceed',
          handler: () => {
            this.onSubmit();
          }
        }
      ]
    });

    await alert.present();
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }


}
