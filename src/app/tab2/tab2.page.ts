import { FWRemoteDraftData, ActivityDetail } from './../interfaces/fwdata';
import { LoaderService } from './../providers/loader.service';
import { Facility } from './../interfaces/user-options';
import { FWLocalDraftData } from './../interfaces/fwlocalDB';
import { ApiClientService } from './../service/rest/api-interface.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { UserData } from '../providers/user-data';
import { StorageService } from '../service/stored-data/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  facilityList: Facility[] = [];
  fwLocalDraftDataList: FWLocalDraftData[] = [];
  facilityWiseFwLocalDraftData: FacilityWiseLocalDraftData[] = [];
  facilityWiseRemoteDraftData: FacilityWiseRemoteDraftData[] = [];
  unSyncedFwLocalDraftData: FWLocalDraftData[] = [];


  segment: string = "local";


  localDataSyncedCount: number = 0;
  lastSynced: string;

  constructor(public userData: UserData,
    public storageService: StorageService,
    public route: ActivatedRoute,
    public apiClient: ApiClientService,
    public ionLoader: LoaderService) {
  }

  async ionViewDidEnter(): Promise<void> {
    console.log('ngOnInit');
    this.fetchLocalDraftData();
  }


  async initStage() {
    this.facilityList = this.storageService.facilities;
    this.localDataSyncedCount = 0;
    this.unSyncedFwLocalDraftData = [];
    this.fwLocalDraftDataList = [];
    this.facilityWiseFwLocalDraftData = [];
  }


  async fetchLocalDraftData() {
    this.initStage();
    const date = await this.userData.getSyncedDate();
    if (date) {
      this.lastSynced = new Date(date).toDateString();
    }

    for (let facility of this.facilityList) {
      let facilityLocalDraftDataList = await this.userData.getDraftDataFromStorageByFacility(facility.id.toString());
      let facilityWiseLocalDraftDataItem: FacilityWiseLocalDraftData = {
        facility_id: facility.id,
        facility_name: facility.name,
        fw_draft_data: facilityLocalDraftDataList
      };
      this.fwLocalDraftDataList = this.fwLocalDraftDataList.concat(facilityLocalDraftDataList);
      this.facilityWiseFwLocalDraftData = this.facilityWiseFwLocalDraftData.concat(facilityWiseLocalDraftDataItem);
    }

    for (let fwLocalData of this.fwLocalDraftDataList) {
      if (fwLocalData?.synced) {
        this.localDataSyncedCount++;
      }
      else {
        this.unSyncedFwLocalDraftData.push(fwLocalData);
      }
    }
  }


  async fetchRemoteDraftData() {
    this.facilityWiseRemoteDraftData = [];
    for (let facility of this.facilityList) {
      const value = await this.apiClient.loadFWPrevDraftDataByFacility(facility.id);
      let facilityWiseRemoteDraftDataItem: FacilityWiseRemoteDraftData = {
        facility_id: facility.id,
        facility_name: facility.name,
        fw_draft_data: value?.data,
        hidden: true,
        icon: "chevron-down-outline"
      };
      this.facilityWiseRemoteDraftData = this.facilityWiseRemoteDraftData.concat(facilityWiseRemoteDraftDataItem);
    }
  }




  onExpandToggle(facilityWiseDraftDataItem: FacilityWiseRemoteDraftData) {
    if (facilityWiseDraftDataItem.hidden) {
      facilityWiseDraftDataItem.hidden = false;
      facilityWiseDraftDataItem.icon = "chevron-up-outline";
    }
    else {
      facilityWiseDraftDataItem.hidden = true;
      facilityWiseDraftDataItem.icon = "chevron-down-outline"
    }
  }

  deleteDraftData() {
    this.ionLoader.presentAlertConfirmCallback('Draft Data Delete', 'Are you sure you want to clear draft data list of all facilities', async (status: string) => {
      for (let facility of this.facilityList) {
        const value = await this.userData.setLocalDraftDataByFacility(facility.id.toString(),[]);
      }
      this.fetchLocalDraftData();
      this.ionLoader.presentToast('Successfully deleted all local draft data');
    });

  }

  async syncData() {
    if (this.unSyncedFwLocalDraftData?.length > 0) {
      const val = await this.apiClient.uploadFWLocalDraftDataInServer(this.userData.userData.user.id.toString(), this.unSyncedFwLocalDraftData);

      if (val?.success) {
        this.ionLoader.presentAlertConfirm('Local data sync', 'Successfully uploaded local draft data to remote serve as backup');
        this.userData.setSyncedDate(new Date().toISOString());
        for (let facilityFwLocalDraftDataItem of this.facilityWiseFwLocalDraftData) {
          facilityFwLocalDraftDataItem.fw_draft_data.map((item: FWLocalDraftData) => {
            item.synced = true;
          });
          console.log(facilityFwLocalDraftDataItem.fw_draft_data);
          await this.userData.setLocalDraftDataByFacility(facilityFwLocalDraftDataItem.facility_id.toString(), facilityFwLocalDraftDataItem.fw_draft_data);
        }
        this.fetchLocalDraftData();
      }
      else {
        this.ionLoader.presentAlertConfirm('Oops!! Local data sync', 'Could not upload local draft data to remote serve as backup');
      }
    }
    else {
      this.ionLoader.presentAlertConfirm('Draft Data Sync', 'All of your draft data items are synced with server.No items found to upload');
    }
  }





  merge(facilityWiseRemoteDraftDataItem: FacilityWiseRemoteDraftData) {
    this.ionLoader.presentAlertConfirmCallback('Draft Data Merge', 'Do you want to merge remote data to this facilities local data', async (status: string) => {
      let facilityWiseLocalDraftDataItem = this.facilityWiseFwLocalDraftData.find((item: FacilityWiseLocalDraftData) => {
        return item.facility_id == facilityWiseRemoteDraftDataItem.facility_id;
      });

      let conflictCount = 0;
      let newDraftDataItemCount = 0;
      if (facilityWiseLocalDraftDataItem) {
        for (let fwDraftData of facilityWiseRemoteDraftDataItem.fw_draft_data) {
          let fwLocalDDFoundItem:FWLocalDraftData = facilityWiseLocalDraftDataItem.fw_draft_data.find((item: FWLocalDraftData) => {
            if (fwDraftData?.sync_id == item?.sync_id) {
              conflictCount++;
              return item;
            }
            else{
              console.log('Not matched local item ', item);
            }
          });
          if (!fwLocalDDFoundItem) {
            console.log('Item not Found you better insert it');
            let activity_detail: ActivityDetail = {
                name: this.storageService.getActivityName(fwDraftData.activity_id),
              male_value : fwDraftData.reached_male,
              female_value : fwDraftData.reached_female,
              activity_id: fwDraftData.activity_id
            };

            let newLocalDraftData = new FWLocalDraftData(activity_detail, new Date(fwDraftData.updated_at) ,new Date(fwDraftData.created_at), fwDraftData.period, fwDraftData.remarks,fwDraftData.month,fwDraftData.year,fwDraftData.facility_id.toString() );
            newDraftDataItemCount++;
            facilityWiseLocalDraftDataItem.fw_draft_data = facilityWiseLocalDraftDataItem.fw_draft_data.concat(newLocalDraftData);
          }
        }

        await this.userData.setLocalDraftDataByFacility(facilityWiseLocalDraftDataItem.facility_id.toString(), facilityWiseLocalDraftDataItem.fw_draft_data);
        await this.fetchLocalDraftData();

        this.ionLoader.presentAlertConfirm('Draft Data Merge',
          `Total ${facilityWiseRemoteDraftDataItem.fw_draft_data?.length} items found.
        ${conflictCount} items already exists in your local db so skipped them.
        ${newDraftDataItemCount} items were inserted in your local db.`);
      }
      else {
        this.ionLoader.presentAlertConfirm('Draft Data Merge', 'You are not assigned to this facility so you cannot merge to this facility.');
      }
    });

  }

  segmentChanged(event: Event) {
    if (this.segment == 'remote' && this.facilityWiseRemoteDraftData?.length == 0) {
      this.fetchRemoteDraftData();
    }
  }


}



interface FacilityWiseDraftData {
  "facility_id": number;
  "facility_name": string;
  "fw_draft_data": any[];
}

export interface FacilityWiseLocalDraftData extends FacilityWiseDraftData {
  "fw_draft_data": FWLocalDraftData[];
}

export interface FacilityWiseRemoteDraftData extends FacilityWiseDraftData {
  "fw_draft_data": FWRemoteDraftData[];
  "hidden": boolean;
  "icon": string;
}

