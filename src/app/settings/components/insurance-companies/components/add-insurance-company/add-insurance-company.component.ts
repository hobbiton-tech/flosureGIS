import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsuranceCompanyService } from '../../services/insurance-company.service';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';

@Component({
  selector: 'app-add-insurance-company',
  templateUrl: './add-insurance-company.component.html',
  styleUrls: ['./add-insurance-company.component.scss']
})
export class AddInsuranceCompanyComponent implements OnInit {

  insuranceCompanyDetailsForm: FormGroup;

  @Input()
  isAddInsuranceCompanyDrawerVisible: boolean;

  @Output()
  closeAddInsuranceCompanyDrawer: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder, 
    private storage: AngularFireStorage,
    private insuranceCompanyService: InsuranceCompanyService) {
    
   }

  ngOnInit(): void {
    this.insuranceCompanyDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      companyName: ['', Validators.required],
      companyEmail: ['', Validators.required],
      contactFirstName: ['', Validators.required],
      contactSecondName: ['', Validators.required],
      companyCode: ['', Validators.required],
      dateCreated: ['', Validators.required],
      contract: ['', Validators.required]
    });
  }

   //handle file uploads
   uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `broker-contracts`;
    const task = this.storage.upload(filePath, file);
  }

  onSubmit() {
    console.log(this.insuranceCompanyDetailsForm.value);
    const insurance_company_details = this.insuranceCompanyDetailsForm.value;
    this.insuranceCompanyService.addInsuranceCompany(insurance_company_details);
    this.insuranceCompanyDetailsForm.reset();
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.insuranceCompanyDetailsForm.reset();
  }

  closeDrawer(): void {
    this.closeAddInsuranceCompanyDrawer.emit();
  }

}
