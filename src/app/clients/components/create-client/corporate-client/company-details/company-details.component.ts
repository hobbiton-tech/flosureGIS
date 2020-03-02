import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-company-details',
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
    // Declarations
    companyDetailsForm: FormGroup;

    // Sector values
    listOfOption = ['Finance', 'Agriculture', 'Energy'];
    listOfSelectedValue: string[] = [];

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.companyDetailsForm = this.formBuilder.group({
            company_name: ['', Validators.required],
            tpin_number: ['', Validators.required],
            email: ['', Validators.required],
            address: ['', Validators.required],
            phone_number: ['', Validators.required],
            sector: ['', Validators.required]
        });
    }

    get f() {
        return this.companyDetailsForm.controls;
    }

    onSubmit() {
        this.stepperService.changeIndex(2);
        this.router.navigateByUrl('/contact-person');
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(1);
    }
}
