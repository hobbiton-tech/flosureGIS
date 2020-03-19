import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {
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

  ngOnInit(): void {}

  onSubmit() {
    const insurance_company_details = this.insuranceCompanyDetailsForm.value;
    console.log(insurance_company_details);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.insuranceCompanyDetailsForm.reset();
  }

  closeDrawer(): void {
    this.closeAddInsuranceCompanyDrawer.emit();
  }

}
