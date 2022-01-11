import { GenericServerResponse } from './../../interfaces/common';
import { FWSubmissionRelatedApiData } from './../../interfaces/fwdata';
import { UserData } from './../../providers/user-data';
import { FWDraftApiResponse, FWSubmissionRelatedDataApiResponse, ActivityDetail, ActivityListApiResponse, GroupByActivityDetailsApiResponse, GroupedActivityDetailsData } from '../../interfaces/fwdata';
import { UserLoginApiResponse, UserOptions, Facility, FacilitiesApiResponse } from './../../interfaces/user-options';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, first, map, tap } from 'rxjs/operators';
import { StorageService } from '../stored-data/storage.service';
import { LoaderService } from '../../providers/loader.service';
import * as apiUrls from '../../interfaces/url';
import { FWFinalDataApiResponse } from 'src/app/interfaces/fwfinal';
import { FWLocalDraftData } from 'src/app/interfaces/fwlocalDB';


@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  data: any;
  constructor(private httpClient: HttpClient,
    private storageService: StorageService,
    private ionLoader: LoaderService,
    private router: Router,
    private userData: UserData) { }

  /** User api methods */
  login(user: UserOptions): Promise<UserLoginApiResponse> {

    let url = apiUrls.authBaseUrl + "email=" + user.useremail + "&password=" + user.password;
    //this.preflight(url);
    return this.httpClient.post(url, { "useremail": user.useremail, "password": user.password })
      .pipe(
        map((serverResponse: UserLoginApiResponse) => {
          return serverResponse;
        }),
        catchError((error: any) => {
          this.handleError(error);
          return [];
        })
      ).toPromise();
  }


  //** Get facilities of user */
  getFacilities(user_id: any): Promise<FacilitiesApiResponse> {
    let url = apiUrls.dataBaseUrl+"facilities_list/"+user_id;
    return this.httpClient.get(url)
      .pipe(
        map((serverResponse: FacilitiesApiResponse) => {
          return serverResponse;
        }),
        tap(async (response: FacilitiesApiResponse) => {
          this.saveFacilities(response);
        }),
        catchError(async (error: any) => {
          const value  =  await this.retrieveFacilities();
          console.log('sending saved version', value);
          return value;
        })
      ).toPromise();
  }

  async saveFacilities(response: FacilitiesApiResponse) {
    this.storageService.facilities = response.data.facilities;
    await  this.userData.saveFacilitiesForLater(response);
  }
  async retrieveFacilities(){
    const value = await this.userData.getSavedFacilitiesResponse();
    this.storageService.facilities = value.data.facilities;
    return value;
   }

  /** load all Activities */
  loadActivitiesAndDetails(): Promise<ActivityListApiResponse> {
    let url = apiUrls.dataBaseUrl + "activity_details";
    return this.httpClient.get(url)
      .pipe(
        map((serverResponse: ActivityListApiResponse) => {
          return serverResponse;
        }),
        tap(async (response: ActivityListApiResponse) => {
          this.saveActivities(response);
        }),
        catchError(async (error: any) => {
          const value  =  await this.retrieveActivities();
          console.log('sending saved version', value.data.activities);
          return value;
        })
      ).toPromise();
  }

  async saveActivities(response:ActivityListApiResponse){
    this.storageService.activities = response.data.activities;
    this.storageService.activity_details = response.data.activity_details;
    this.userData.saveActivityResponseForLater(response);
  }

  async retrieveActivities():Promise<ActivityListApiResponse>{
    const value = await this.userData.getSavedActivityResponse();
    this.storageService.activities = value.data.activities;
    this.storageService.activity_details = value.data.activity_details;
    return value;

  }


  /** load Activities and Submission Data for 4W draft submission */
  loadFWSubmissionRelatedDataByFacility(facility_id: number): Promise<FWSubmissionRelatedDataApiResponse> {
    let url = apiUrls.dataBaseUrl + "fwdraft_submission/" + facility_id;
    return this.httpClient.get(url)
      .pipe(
        map((serverResponse: FWSubmissionRelatedDataApiResponse) => {
          return serverResponse;
        }),
        tap(async (response: FWSubmissionRelatedDataApiResponse) => {
          this.saveSubmissionData(response.data);
        }),
        catchError(async (error: any) => {
          const value  =  await this.retrieveSubmissionData(facility_id);
          console.log('sending saved version', value);
          return new GenericServerResponse(true,"Something went wrong!",value);
        })
      ).toPromise();
  }

  async saveSubmissionData(response:FWSubmissionRelatedApiData){
    this.userData.saveFacilitiesSubmissionData(response);
  }

  async retrieveSubmissionData(facility_id):Promise<FWSubmissionRelatedApiData>{
    const value = await this.userData.getSavedFacilitiesSubmissionData(facility_id);
    return value;
  }


  /** load previous draft data of a facility */
  loadFWPrevDraftDataByFacility(facility_id: number): Promise<FWDraftApiResponse> {
    let url = apiUrls.dataBaseUrl + "fwdraft_data/" + facility_id;
    return this.httpClient.get(url)
      .pipe(
        map((serverResponse: FWDraftApiResponse) => {
          return serverResponse;
        }),
        tap(async (response: FWDraftApiResponse) => {

        }),
        catchError((error: any) => {
          this.handleError(error);
          return [];
        })
      ).toPromise();
  }

  /** load  draft data of a facility group by period and activity for submission */
  loadFWDraftDataGroupedActivityWiseByFacilityIdForFinalSubmission(period: string, facility_id: string): Promise<GroupByActivityDetailsApiResponse> {
    let url = apiUrls.dataBaseUrl + "groupby_activity/" + period + "/" + facility_id;
    return this.httpClient.get(url)
      .pipe(
        map((serverResponse: GroupByActivityDetailsApiResponse) => {
          return serverResponse;
        }),
        catchError((error: any) => {
          this.handleError(error);
          return [];
        })
      ).toPromise();
  }

  loadFinalSubmissionDataByCamp(): Promise<FWFinalDataApiResponse> {
    let url = apiUrls.dataBaseUrl + "fw_api";
    return this.httpClient.get(url)
      .pipe(
        map((serverResponse: FWFinalDataApiResponse) => {
          return serverResponse;
        }),
        tap(async (response: FWFinalDataApiResponse) => {

        }),
        catchError((error: any) => {
          this.handleError(error);
          return [];
        })
      ).toPromise();
  }

  async saveFWLocalDraftData(user_id: string, facility_id: string,year:number, month: number,
    remarks: string, reporting_period: string,
    activity_details: ActivityDetail[])
    : Promise<GenericServerResponse> {
    const data = await this.userData.getDraftDataFromStorageByFacility(facility_id);
    console.log(data);
    if (data) {
      for(var i=0;i<activity_details.length;i++){
        var fwLocalDraftData: FWLocalDraftData = new FWLocalDraftData(activity_details[i],
          new Date(), new Date(), reporting_period, remarks, month ,year,facility_id);
          data.push(fwLocalDraftData);
        }
        await this.userData.setLocalDraftDataByFacility(facility_id,data);
        return new GenericServerResponse(true , "Draft data saved successfully",data);
      }
    else{
      return new GenericServerResponse(false , "Could not save draft data",data);
    }







    /*let firstPart = "fwdraft_api?reporting_month=" + reporting_month + "&activity_detail_id[0]=" + activity_details[0].id + "&reached_female[0]=" + values[0].reachedFemale + "&reached_male[0]=" + values[0].reachedMale + "&remarks=" + remarks + "&facility_id=" + facility_id + "&user_id=" + user_id + "&";
    let activity_id_part = "";
    let male_value_part = "";
    let female_value_part = "";

    for (let i = 1; i < activity_details.length; i++) {
      activity_id_part = activity_id_part + "activity_detail_id[" + i + "]=" + activity_details[i].id + "&";
      male_value_part = male_value_part + "reached_male[" + i + "]=" + activity_details[i].male_value + "&";
      female_value_part = female_value_part + "reached_female[" + i + "]=" + activity_details[i].female_value + "&";
    }
    male_value_part = male_value_part.substr(0, male_value_part.length - 1);
    let url = apiUrls.dataBaseUrl + firstPart + activity_id_part + female_value_part + male_value_part;
    return this.httpClient.post(url, {})
      .pipe(
        map((serverResponse: GenericServerResponse) => {
          this.ionLoader.presentToast(serverResponse.message);
          return serverResponse;
        }),
        tap(async (response: GenericServerResponse) => {

        }),
        catchError((error: any) => {
          this.handleError(error);
          return [];
        })
      ).toPromise();*/

  }

  async uploadFWLocalDraftDataInServer(user_id: string,fwLocalDraftData: FWLocalDraftData[])
    : Promise<GenericServerResponse> {

    let endpoint = "fwdraft_data_sync?";
    let firstPart = "activity_detail_id[0]=" + fwLocalDraftData[0].activity_detail.id + "&reached_female[0]=" +fwLocalDraftData[0].activity_detail.female_value + "&reached_male[0]=" + fwLocalDraftData[0].activity_detail.male_value + "&remarks[0]=" + fwLocalDraftData[0].remarks + "&facility_id[0]=" + fwLocalDraftData[0].facility_id + "&user_id=" + user_id + "&";
    let reporting_month_part = "reporting_month[0]=" + fwLocalDraftData[0].period+"&";

    let activity_id_part = "";
    let male_value_part = "";
    let female_value_part = "";
    let remarks_part = "";
    let facility_id_part = "";

    for (let i = 1; i < fwLocalDraftData.length; i++) {
      reporting_month_part = reporting_month_part+`reporting_month[${i}]=${fwLocalDraftData[0].period}`+"&";
      activity_id_part = activity_id_part + "activity_detail_id[" + i + "]=" + fwLocalDraftData[i].activity_detail.id + "&";
      male_value_part = male_value_part + "reached_male[" + i + "]=" + fwLocalDraftData[i].activity_detail.male_value + "&";
      female_value_part = female_value_part + "reached_female[" + i + "]=" + fwLocalDraftData[i].activity_detail.female_value + "&";
      remarks_part = remarks_part + "remarks[" + i + "]=" + fwLocalDraftData[i].remarks + "&";
      facility_id_part = facility_id_part + "facility_id[" + i + "]=" + fwLocalDraftData[i].facility_id + "&";
    }
    facility_id_part = facility_id_part.substr(0, facility_id_part.length - 1);
    let url = apiUrls.dataBaseUrl+endpoint+reporting_month_part+firstPart+activity_id_part+female_value_part+male_value_part+remarks_part+facility_id_part;
    return this.httpClient.post(url, {})
      .pipe(
        map((serverResponse: GenericServerResponse) => {
          this.ionLoader.presentToast(serverResponse.message);
          return serverResponse;
        }),
        catchError((error: any) => {
          this.handleError(error);
          return [];
        })
      ).toPromise();

  }

  uploadFWDraftDataFinalStore(facility_id: string, reporting_period: string, activity_details: GroupedActivityDetailsData[])
    : Promise<GenericServerResponse> {

    let firstPart = "fw_api?reporting_month=" + reporting_period + "&" + "facility_id=" + facility_id + "&";
    let activity_id_part = "";
    let male_value_part = "";
    let female_value_part = "";

    for (let i = 0; i < activity_details.length; i++) {
      activity_id_part = activity_id_part + "activity_detail_id[" + i + "]=" + activity_details[i].activity_detail_id + "&";
      male_value_part = male_value_part + "reached_male[" + i + "]=" + activity_details[i].reached_male + "&";
      female_value_part = female_value_part + "reached_female[" + i + "]=" + activity_details[i].reached_female + "&";
    }
    male_value_part = male_value_part.substr(0, male_value_part.length - 1);
    let url = apiUrls.dataBaseUrl + firstPart + activity_id_part + female_value_part + male_value_part;
    return this.httpClient.post(url, {})
      .pipe(
        map((serverResponse: GenericServerResponse) => {
          this.ionLoader.presentToast(serverResponse.message);
          return serverResponse;
        }),
        tap(async (response: GenericServerResponse) => {
        }),
        catchError((error: any) => {
          this.handleError(error);
          return [];
        })
      ).toPromise();

  }



  /** Handle response errors */
  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status == 401) {
        if (error?.error) {
          this.ionLoader.presentToast(error?.error.message);
        }
        else {
          this.ionLoader.presentToast("Your session is expired.please Login again.");
        }
        //this.router.navigateByUrl('login', { replaceUrl: true });
      }
    }
    else if (error instanceof Error) {
      this.ionLoader.presentToast(error.message);
    }
    else {
      this.ionLoader.presentToast("Something Went wrong. please try again");
    }

  }


  //** load dynamic colors and icons for decorating activity*/
  activityIcon = {
    "Screening": "Screening.svg",
    "Severe Acute Malnutrition": "SAM.svg",
    "Moderate Acute Malnutrition": "MAM.svg",
    "Blanket Supplementation Feeding Program": "TSFP.svg",
    "Disability": "Disability.svg",
    "Infant and Young Children Feeding": "IYCF.svg",
    "Micronutrient Supplement": "Micro-Nutritinent-Supplement.svg",
    "Supply": "Supply.svg",
    "Early Childhood Development": "ECCD.svg",
    "MPHSS": "MPHSS.svg",
    "Stabilization Center": "SC.svg"
  }
  activityColors: string[] = ["dark", "warning", "favorite", "instagram", "facebook", "google"];
  getActivityIcon(index: number, activity_name: string) {
    return this.activityIcon[activity_name] ? '../../../assets/img/activities/' + this.activityIcon[activity_name] : "home";
  }
  getActivityColor(index: number) {

    var i = Math.ceil(index % this.activityColors.length);
    if (index < this.activityColors.length)
      return this.activityColors[index];
    else
      return this.activityColors[i];
  }
  getCampIcon(index: number, ben_type: string) {
    return "assets/icon/refugees.svg";
    //return this.campIcon[ben_type];
  }
  campIcon = {
    "refugees": "trail-sign"
  }

  /** load local data for simulation
  load(): Promise<LocalData> {
    return this.httpClient
      .get('assets/data/data.json')
      .pipe(map(this.processData, this)).toPromise();
  }


  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data;

    // loop through each day in the schedule
    this.data.schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each session in the timeline group
        group.sessions.forEach((session: any) => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach((speakerName: any) => {
              const speaker = this.data.speakers.find(
                (s: any) => s.name === speakerName
              );
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }
        });
      });
    });

    return this.data;
  }*/

}


