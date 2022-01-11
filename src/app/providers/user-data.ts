import { FWLocalDraftData } from 'src/app/interfaces/fwlocalDB';
import { UserLoginApiData, Facility, FacilitiesApiResponse } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivityListApiResponse, FWSubmissionRelatedApiData } from '../interfaces/fwdata';


@Injectable({
  providedIn: 'root'
})
export class UserData {

  favorites: string[] = [];
  userData: UserLoginApiData;
  USER_LOGIN_DATA = 'UserLoginApiData';
  HAS_SEEN_TUTORIAL = 'ion_did_tutorial';
  DRAFT_DATA = 'local_draft_data';
  ACTIVITIES_LIST = 'activities_list';
  FACILITIES_RESP: string = 'facilities_list';
  LAST_SYNCED: string = 'last_synced';
  FACILITIES_SUBMISSION_ACTIVITIES: string = 'facility_activities';




  constructor(
    public storage: Storage
  ) { }



  login(userData: UserLoginApiData): Promise<any> {
    return this.storage.set(this.USER_LOGIN_DATA, JSON.stringify(userData)).then(() => {
      this.setUserLoginApiData(userData);
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  signup(userData: string): Promise<any> {
    return this.storage.set(this.USER_LOGIN_DATA, userData).then(() => {
      //this.setUserData(userData);
      return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.USER_LOGIN_DATA).then(() => {
    }).then(() => {
      window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }

  setUserLoginApiData(userData: UserLoginApiData) {
    this.userData = userData;
  }

  getUserLoginApiData() {
    return this.userData;
  }

  getUserLoginApiDataFromStorage(): Promise<UserLoginApiData> {
    return this.storage.get(this.USER_LOGIN_DATA).then((value) => {
      return <UserLoginApiData>JSON.parse(value);
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.USER_LOGIN_DATA).then((value) => {
      if (value) {
        this.setUserLoginApiData(<UserLoginApiData>JSON.parse(value));
      }
      return this.userData != null;
    });
  }

  hasFavorite(sessionName: string): boolean {
    return (this.favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }


  async checkDidSeenTutorial(arg1: boolean): Promise<boolean> {
    const value = await this.storage.set(this.HAS_SEEN_TUTORIAL, arg1);
    return value;
  }

  async checkHasSeenTutorial(): Promise<string> {
    const value = await this.storage.get(this.HAS_SEEN_TUTORIAL);
    return value;
  }


  //** Last synced status */
  setSyncedDate(value:String): Promise<any> {
    return this.storage.set(this.LAST_SYNCED, value);
  }

  async getSyncedDate(): Promise<string> {
    const value = await this.storage.get(this.LAST_SYNCED);
    return value;
  }




  //** Save and retrieve activities and detail activities **/
  saveActivityResponseForLater(activity_response:ActivityListApiResponse): Promise<any> {
    return this.storage.set(this.ACTIVITIES_LIST, activity_response);
  }

  async getSavedActivityResponse(): Promise<ActivityListApiResponse> {
    const value = await this.storage.get(this.ACTIVITIES_LIST);
    const data = <ActivityListApiResponse>value;
    return data;
  }


  //** Save and retrieve Facilities */
  saveFacilitiesForLater(response: FacilitiesApiResponse) {
    return this.storage.set(this.FACILITIES_RESP, response);
  }

  async getSavedFacilitiesResponse(): Promise<FacilitiesApiResponse> {
    const value = await this.storage.get(this.FACILITIES_RESP);
    const data = <FacilitiesApiResponse>value;
    return data;
  }


  /**Save and retrieve submission data of facilities */

  saveFacilitiesSubmissionData(response: FWSubmissionRelatedApiData) {
    return this.storage.set(this.FACILITIES_SUBMISSION_ACTIVITIES+response.facility_info.id, response);
  }

  async getSavedFacilitiesSubmissionData(facility_id:any): Promise<FWSubmissionRelatedApiData> {
    const value = await this.storage.get(this.FACILITIES_SUBMISSION_ACTIVITIES+facility_id);
    const data = <FWSubmissionRelatedApiData>value;
    return data;
  }













  //** Operation on draft data */

  setLocalDraftDataByFacility(facility_id:string,draftData: FWLocalDraftData[]): Promise<any> {
    return this.storage.set(this.DRAFT_DATA+facility_id, draftData).then(() => {
      return window.dispatchEvent(new CustomEvent('user:draftdata_saved'));
    });
  }

  async deleteFacilityLocalDraftDataByIndex(facility_id:string,index: number) {
    const value = (await this.getDraftDataFromStorageByFacility(facility_id))
    value.splice(index, 1);
    return this.setLocalDraftDataByFacility(facility_id,value);
  }

  async deleteLocalDraftDataByFacility(facility_id:string) {
    return this.storage.remove(this.DRAFT_DATA+facility_id).then(() => {
      return window.dispatchEvent(new CustomEvent('user:draftdata_removed'));
    });
  }

  async  deleteFacilityLocalDraftDataByPeriod(facilityId: any, period: string) {
    const value = (await this.getDraftDataFromStorageByFacility(facilityId)).
    filter((draftData:FWLocalDraftData)=>{
      if(draftData.period != period){
        return draftData;
      }
    });
    return this.setLocalDraftDataByFacility(facilityId,value);
  }

  async editFacilityLocalDraftDataItemByIndex(facility_id:string,index: number, editedData: FWLocalDraftData): Promise<any> {
    const value = await this.getDraftDataFromStorageByFacility(facility_id);
    value[index] = editedData;
    return this.setLocalDraftDataByFacility(facility_id,value);
  }


  async getFacilityDraftDataFromStorageByIndex(facility_id:string,index:number): Promise<FWLocalDraftData> {
    const value = await this.getDraftDataFromStorageByFacility(facility_id)
    const data = <FWLocalDraftData[]>value;
    return value[index];
  }


  async getDraftDataFromStorageByFacility(facility_id:string): Promise<FWLocalDraftData[]> {
    const value = await this.storage.get(this.DRAFT_DATA + facility_id);
    const data = <FWLocalDraftData[]>value;
    if (data) {
      return data;
    }
    return [];
  }


}
