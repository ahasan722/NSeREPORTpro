import { GenericServerResponse } from 'src/app/interfaces/common';

export interface FWFinalDataApiResponse extends GenericServerResponse{
  data:    FWFinalData[];
}

export interface FWFinalData{
    id:                 number;
    period:             string;
    year:               number;
    month:              number;
    pp_id:              number;
    ip_id:              number;
    donor_id:           number;
    sector_id:          number;
    activity_id:        number;
    activity_detail_id: number;
    qty_planned:        number;
    qty_achieved:       number;
    activity_status:    string;
    country_id:         number;
    division_id:        number;
    district_id:        number;
    upazila_id:         number;
    union_id:           number;
    camp_id:            number;
    facility_id:        number;
    report_date:        string;
    program_start:      string;
    program_end:        string;
    beneficiary_type:   string;
    reached_female:     number;
    reached_male:       number;
    notes:              string;
    user_id:            number;
    created_at:         Date;
    updated_at:         Date;
}

