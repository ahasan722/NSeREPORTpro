import { GenericServerResponse } from 'src/app/interfaces/common';



/**
 * Submission Related Data models
 */
export interface FWSubmissionRelatedDataApiResponse extends GenericServerResponse{
  data: FWSubmissionRelatedApiData;

}

export interface FWSubmissionRelatedApiData {
  facility_info:    FacilityInfo;
  activity_details: ActivityDetail[];
  activity:         Activity[];
}


/**
 * List of all available activities and activities detail
 */
export interface ActivityListApiResponse extends GenericServerResponse{
  data:ActivityListData;
}

export interface ActivityListData{
  activities: Activity[];
  activity_details: ActivityDetail[];
}


/**
 * Grouped activity detail
 */
export interface GroupByActivityDetailsApiResponse extends GenericServerResponse{
  data: {data: GroupedActivityDetailsData[]};
}

export class GroupedActivityDetailsData{
    activity_detail_name: string;
    activity_detail_id: number;
    period: string;
    activity_name: string;
    activity_id: number;
    reached_female: string;
    reached_male: string;

    constructor(activity_detail_name,activity_detail_id,period,activity_name,activity_id,reached_female,reached_male){
      this.activity_detail_id = activity_detail_id;
      this.activity_detail_name = activity_detail_name;
      this.period = period;
      this.activity_name = activity_name;
      this.activity_id = activity_id;
      this.reached_male = reached_male;
      this.reached_female = reached_female;
    }

}



/**
 * Remote DraftData API
 */
export interface FWDraftApiResponse extends GenericServerResponse{
  data: FWRemoteDraftData[];
}


/**
 * Base models like Activity,ActivityDetail ...
 */
export interface Activity {
    id:         number;
    name:       string;
    sector_id:  number;
    created_at: Date;
    updated_at: Date;

}

export interface ActivityDetail {
  id?:          number;
  name:        string;
  activity_id: number;
  created_at?:  Date;
  updated_at?:  Date;
  male_value:number;
  female_value:number;
  pivot?:      Pivot;
}


export interface Pivot {
  facility_id:        number;
  activity_detail_id: number;
}

export interface FacilityInfo {
  id:               number;
  ssid:             string;
  facility_no:      string;
  name:             string;
  camp_id:          number;
  pp_id:            number;
  ip_id:            number;
  latitude:         string;
  longitude:        string;
  beneficiary_type: string;
  status:           string;
  created_at:       null;
  updated_at:       Date;
  activity_details: ActivityDetail[];
}

export interface FWRemoteDraftData{

  id: number;
  period: string;
  year: number;
  month: number;
  activity_id: number;
  activity_detail_id: number;
  facility_id: number;
  reached_female: number;
  reached_male: number;
  user_id: number;
  remarks: string;
  created_at: string;
  updated_at: string;
  sync_id?: any;
  synced?: any;
}


