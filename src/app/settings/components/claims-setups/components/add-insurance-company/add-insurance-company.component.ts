import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClaimsService } from 'src/app/claims/services/claims-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { IInsuranceCompany } from 'src/app/claims/models/insurance-company.model';

@Component({
    selector: 'app-add-insurance-company',
    templateUrl: './add-insurance-company.component.html',
    styleUrls: ['./add-insurance-company.component.scss']
})
export class AddInsuranceCompanyComponent implements OnInit {
    isAddingInsuranceCompany: boolean = false;

    @Input()
    isAddInsuranceCompanyModalVisible: boolean;

    @Output()
    closeAddInsuranceCompanyModalEmitter: EventEmitter<
        any
    > = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService,
        private msg: NzMessageService
    ) {}

    insuranceCompanyDetailsForm: FormGroup;

    ngOnInit(): void {
        this.insuranceCompanyDetailsForm = this.formBuilder.group({
            companyName: ['', Validators.required],
            registrationNumber: [''],
            tPin: [''],
            physicalAddress: ['', Validators.required],
            postalAddress: [''],
            phone: ['', Validators.required],
            email: ['']
        });
    }

    closeAddInsuranceCompanyModal() {
        this.closeAddInsuranceCompanyModalEmitter.emit(true);
    }

    addInsuranceCompany() {
        this.isAddingInsuranceCompany = true;

        const insuranceCompany: IInsuranceCompany = {
            ...this.insuranceCompanyDetailsForm.value
        };

        this.claimsService.createInsuranceCompany(insuranceCompany).subscribe(
            insuranceCompany => {
                console.log(insuranceCompany);
                this.msg.success('Insurance Comapny added Successfully');
                this.isAddingInsuranceCompany = false;
                this.isAddInsuranceCompanyModalVisible = false;
            },

            err => {
                console.log(err);
                this.msg.error('Failed to add Insurance Company');
                this.isAddingInsuranceCompany = false;
                this.isAddInsuranceCompanyModalVisible = false;
            }
        );
    }
}
