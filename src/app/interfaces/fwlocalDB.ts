import { ActivityDetail, FWRemoteDraftData } from "./fwdata";


export class FWLocalDraftData {
  month: number;
  year: number;
  period: string;
  remarks: string;
  created_at: Date;
  updated_at: Date;
  facility_id: string;
  activity_detail: ActivityDetail;
  synced?:boolean = false;
  sync_id?: any = null;


  constructor(data: ActivityDetail, updated_at: Date, created_at: Date, period: string,
    remarks: string, month: number,
    year: number,facility:string) {

      this.activity_detail = data;
      this.updated_at = updated_at;
      this.created_at = created_at;
      this.period = period;
      this.remarks = remarks;
      this.month = month;
      this.year = year;
      this.facility_id = facility;
  }


  constructFromRemoteObject(fwRemoteDraft: FWRemoteDraftData){

    this.period = fwRemoteDraft.period;
    this.updated_at = this.updated_at;
    this.remarks = fwRemoteDraft.remarks;
    this.month = fwRemoteDraft.month;
    this.year = this.year;
    this.activity_detail.female_value = fwRemoteDraft.reached_female;
    this.activity_detail.male_value = fwRemoteDraft.reached_male;




  }




}
