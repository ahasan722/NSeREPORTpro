import { GenericServerResponse } from "./common";
import { Pivot } from "./fwdata";

export interface UserOptions {
  useremail: string;
  password: string;
  rememberMe:boolean;
}


export interface UserLoginApiResponse extends GenericServerResponse{
   data: UserLoginApiData
}

export interface UserLoginApiData{

  token:string;
  user: UserLoginData;
}


export interface UserLoginData {
  id:                number;
  name:              string;
  email:             string;
  email_verified_at: null;
  is_admin:          number;
  is_status:         number;
  web_access:        number;
  user_type:         string;
  created_at:        Date;
  updated_at:        Date;
  facilities:        Facility[];

}


export interface Facility{

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
  pivot:Pivot;



}

export interface FacilitiesApiResponse extends GenericServerResponse{
  data: {
    "facilities": Facility[];
  }
}




