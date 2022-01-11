import { Facility } from './../../interfaces/user-options';

import { Injectable } from '@angular/core';
import { Activity, ActivityDetail } from 'src/app/interfaces/fwdata';


@Injectable({
  providedIn: 'root'
})



export class StorageService {


  private _facilities: Facility[];
  public get facilities(): Facility[] {
    return this._facilities;
  }
  public set facilities(value: Facility[]) {
    this._facilities = value;
  }

  private _activities: Activity[];
  public get activities(): Activity[] {
    return this._activities;
  }
  public set activities(value: Activity[]) {
    this._activities = value;
  }
  private _activity_details: ActivityDetail[];

  public get activity_details(): ActivityDetail[] {
    return this._activity_details;
  }
  public set activity_details(value: ActivityDetail[]) {
    this._activity_details = value;
  }


  public getActivityName(id:number):string{

    let activity:Activity =  this.activities?.find( (item:Activity,index:Number, onj:Activity[])  => {
       if(item.id == id){
        return item;
      }
    });
    return activity? activity.name : ""+id;

  }

  public getActivityDetailName(id:number):string{

    let activityDetail:ActivityDetail =  this.activity_details?.find( (item:ActivityDetail,index:Number, onj:ActivityDetail[])  => {
       if(item.id == id){
        return item;
      }
    });
    return activityDetail? activityDetail.name : ""+id;

  }



}
