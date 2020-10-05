import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThirdPartyDetails } from '../../models/claim.model';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-third-party-details',
  templateUrl: './add-third-party-details.component.html',
  styleUrls: ['./add-third-party-details.component.scss']
})
export class AddThirdPartyDetailsComponent implements OnInit {

  @Output()
  thirdPartyDetails: EventEmitter<any> = new EventEmitter();

  @Input()
  isAddThirdPartyDetailsModalVisible: boolean;

  isAddThirdPartyDetailsSpinning = false;

  @Output()
  closeAddThirdPartyDetailsEmitter: EventEmitter<any> = new EventEmitter();

  thirdPartyDetailsForm: FormGroup;
  idTypeOptions = [
    { label: 'NRC', value: 'Insured' },
    { label: 'Passport', value: 'Passport' },
    { label: 'License', value: 'License' }
  ];

  constructor(private formBuilder: FormBuilder, private msg: NzMessageService,) {
    this.thirdPartyDetailsForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      vehicleRegNumber: ['', Validators.required],
      engineNumber: [''],
      color: ['', Validators.required],
      vehicleType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }


  closeAddThirdPartyDetailsModal() {
    this.isAddThirdPartyDetailsModalVisible = false;
  }


  addThirdPartyDetails() {
    console.log('THird >>>', this.thirdPartyDetails);
    this.thirdPartyDetails.emit(this.thirdPartyDetailsForm.value);
    this.msg.success('Third Party Details Entered Successfully.  Kindly continue with the Intimation Process.');
    this.isAddThirdPartyDetailsModalVisible = false;
  }

}
