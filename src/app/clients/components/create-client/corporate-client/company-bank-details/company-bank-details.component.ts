import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-company-bank-details',
    templateUrl: './company-bank-details.component.html',
    styleUrls: ['./company-bank-details.component.scss']
})
export class CompanyBankDetailsComponent implements OnInit {
    // Declarations
    bankDetailsForm: FormGroup;

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.bankDetailsForm = this.formBuilder.group({
            account_name: ['', Validators.required],
            account_number: ['', Validators.required],
            account_type: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });
    }

    get f() {
        return this.bankDetailsForm.controls;
    }

    onSubmit() {
        this.stepperService.changeIndex(0);
        this.router.navigateByUrl('/clients/create-client');
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(3);
    }
}
