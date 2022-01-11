import { FWRemoteDraftData } from '../interfaces/fwdata';
import { CampDraftdataFinalProcessPage } from '../camp-draftdata-grouped-final-upload/camp-draftdata-final-process.page';
import { CampEditDraftDataPage } from '../camp-draft-data-edit/camp-edit-draft-data.page';
import { LoaderService } from '../providers/loader.service';
import { StorageService } from '../service/stored-data/storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Facility } from '../interfaces/user-options';
import { UserData } from '../providers/user-data';
import { ApiClientService } from '../service/rest/api-interface.service';
import { FWLocalDraftData } from '../interfaces/fwlocalDB';

@Component({
  selector: 'app-camp-draft-data',
  templateUrl: './camp-draft-data.page.html',
  styleUrls: ['./camp-draft-data.page.scss'],
})
export class CampDraftDataPage implements OnInit {


  facility: Facility;
  fwdraftData: FWRemoteDraftData[];
  fwLocalDraftData: FWLocalDraftData[];


  ngOnInit() {
  }


  constructor(private userData: UserData,
    private route: ActivatedRoute,
    public apiClient: ApiClientService,
    public modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet,
    public storageService: StorageService,
    public ionLoader: LoaderService) {
    this.facility = this.userData.getUserLoginApiData()?.user.facilities[this.route.snapshot.paramMap.get('facilityIndex')];
    this.getFWDraftDataByFacility();
  }


  async getFWDraftDataByFacility() {
    //** Get draft data from remote source */
    /*
    const value = await this.apiClient.loadFWPrevDraftDataByFacility(this.facility.id);
    if(value?.success){
      this.fwdraftData = value.data;
    }
    */

    //** Get draft data from local source */
    if(this.facility){
      this.fwLocalDraftData = (await this.userData.getDraftDataFromStorageByFacility(this.facility.id.toString()));
    }

    }

  async deleteDraftData(index: number) {
    await this.userData.deleteFacilityLocalDraftDataByIndex(this.facility.id.toString(),index);
    await this.ionLoader.presentToast('Deleted Successfully');
    this.getFWDraftDataByFacility();
    this.ionLoader.presentToast('Deleted Successfully');
  }



  async editDraftData(period,facility_id,index) {

    const modal = await this.modalCtrl.create({
      component: CampEditDraftDataPage,
      swipeToClose: false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        "index": index,
        "period": period,
        "facility_id": facility_id,
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.getFWDraftDataByFacility();
    }
  }

  async draftDataFinalProcess(period, facilityId) {

    const modal = await this.modalCtrl.create({
      component: CampDraftdataFinalProcessPage,
      swipeToClose: false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        "period": period,
        "facilityId": facilityId
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.getFWDraftDataByFacility();
    }
  }



}
