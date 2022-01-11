
import { FWSubmissionRelatedDataApiResponse } from './fwdata';
import { UserLoginApiResponse } from './user-options';

export class GenericServerResponse {

  success : boolean;
  message : string;
  data: any;
  constructor(success:boolean,message:string,data:any){
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

/**
 * For experiments
 */
export interface LocalData{
  loginData: UserLoginApiResponse,
  fwdraft_submission: FWSubmissionRelatedDataApiResponse,
  tracks: any[];
  map:any[];
  speakers:any[];
  schedule:any[];
}
