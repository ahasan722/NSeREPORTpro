import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Activity, ActivityDetail } from '../interfaces/fwdata';
import { FWSubmissionRelatedApiData, FWSubmissionRelatedDataApiResponse } from '../interfaces/fwdata';
import { Facility } from '../interfaces/user-options';
import { Component, OnInit } from '@angular/core';
import { UserData } from '../providers/user-data';
import { ActivatedRoute } from '@angular/router';
import { ApiClientService } from '../service/rest/api-interface.service';
import { FWDraftDataSubmitPage } from '../camp-draft-data-save/fw-draft-data-submit';

@Component({
  selector: 'app-camp-submission',
  templateUrl: './camp-submission.page.html',
  styleUrls: ['./camp-submission.page.scss'],
})
export class CampSubmissionPage implements OnInit {


  facility: Facility;
  fwDraftSubmissionData: FWSubmissionRelatedApiData;
  activity_details:ActivityDetail[];


  constructor(private userData: UserData,
    private route: ActivatedRoute,
    public apiClient: ApiClientService,
    public modalCtrl:ModalController,
    public routerOutlet: IonRouterOutlet) {

    this.facility = this.userData.getUserLoginApiData()?.user.facilities[this.route.snapshot.paramMap.get('facilityIndex')];
    this.getFWSubmissionData();
  }

  ngOnInit() {

  }


  async getFWSubmissionData() {
    const response: FWSubmissionRelatedDataApiResponse = await this.apiClient.loadFWSubmissionRelatedDataByFacility(this.facility?.id);
    if (response?.success) {
      this.fwDraftSubmissionData = response.data;
    }
  }




  async openSubmissionForm(selected_activity:Activity){
    this.activity_details =
    this.fwDraftSubmissionData.facility_info.activity_details.filter((item:ActivityDetail,index:number,items:ActivityDetail[])=>{
       if(item.activity_id == selected_activity.id){
         return item;
       }
    });
    const modal = await this.modalCtrl.create({
        component: FWDraftDataSubmitPage,
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl,
        componentProps: {
          "activity": selected_activity,
          "activity_details" : this.activity_details,
          "facility": this.facility
        }
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) {
        console.log(data);
      }



  }


}
