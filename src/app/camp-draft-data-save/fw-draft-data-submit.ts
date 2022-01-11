import { Facility } from '../interfaces/user-options';
import { LoaderService } from '../providers/loader.service';
import { UserData } from '../providers/user-data';
import { ApiClientService } from '../service/rest/api-interface.service';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivityDetail } from '../interfaces/fwdata';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Activity } from '../interfaces/fwdata';



@Component({
  selector: 'fw-draft-data-submit',
  templateUrl: 'fw-draft-data-submit.html',
  styleUrls: ['./fw-draft-data-submit.scss'],
})
export class FWDraftDataSubmitPage implements OnInit{

  @Input() activity: Activity;
  @Input() activity_details: ActivityDetail[];
  @Input() facility: Facility;


  draftDataForm: FormGroup;


  activityColors: string[] = ["dark", "warning", "favorite", "instagram", "facebook", "github", "google"]
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private modalCtrl: ModalController,
    public apiClient:ApiClientService,private userData:UserData,private ionLoader:LoaderService) {
    this.draftDataForm = this.fb.group({
      reportingPeriod: new FormControl ('', [Validators.required]),
      remarks: new FormControl ('', [Validators.required]),
      beneficiaryDrafts: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.activity_details.forEach(element => {
      this.addBeneficiaryDrafts();
    });
  }


  beneficiaries(): FormArray {
    return this.draftDataForm.get("beneficiaryDrafts") as FormArray
  }

  beneficiaryDraft(): FormGroup {
    return this.fb.group({
      reachedMale : new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      reachedFemale: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
     })
  }

  addBeneficiaryDrafts() {
    this.beneficiaries().push(this.beneficiaryDraft());
  }

  /**
   * Adding values (reachedMale,reachedFemale) from FormArray beneficiaryDrafts
   * back to respected ActivityDetail(male_value,female_value) object
   * in activity_details array matched by index;
   *
   */
  addValueToActivityDetail(){
    for(var i=0;i<this.activity_details.length;i++){
      this.activity_details[i].male_value = this.draftDataForm.get('beneficiaryDrafts').value[i].reachedMale;
      this.activity_details[i].female_value = this.draftDataForm.get('beneficiaryDrafts').value[i].reachedFemale;
    }
  }



  applyFilters() {
    // Pass back a new array of track names to exclude
    //const excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    //this.dismiss(excludedTrackNames);
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

  async onSubmit() {
    console.log(this.draftDataForm.valid);
    this.submitted = true;
    if (this.draftDataForm.valid) {
      if (this.draftDataForm.get('reportingPeriod')) {
        this.addValueToActivityDetail();
        let date: Date = new Date(this.draftDataForm.get('reportingPeriod').value);
        console.log(date);
        let period = date.getMonth()+1 + '-' + date.getFullYear();
        const value = await this.apiClient.saveFWLocalDraftData(this.userData.getUserLoginApiData()?.user.name,this.facility.id.toString(),date.getFullYear(),date.getMonth()+1,this.draftDataForm.get('remarks').value,period,this.activity_details);
        this.ionLoader.presentToast(value.message);
        this.dismiss();
      }
    }
    else {
      console.log('form not valid');
    }

  }
  get errorControl() {
    console.log(this.draftDataForm.controls)
    return this.draftDataForm.controls;
  }

}
