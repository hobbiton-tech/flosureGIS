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
    clientID = 0;

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {}

    get f() {
        return this.companyDetailsForm.controls;
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(1);
        this.companyDetailsForm = this.formBuilder.group({
            companyName: ['', Validators.required],
            tpinNumber: ['', Validators.required],
            registrationNumber: ['', Validators.required],
            email: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            sector: ['', Validators.required],
            clientID: [++this.clientID + 5],
            type: ['Corporate'],
            status: ['Inactive']
        });
    }

    ResetForm() {
        this.companyDetailsForm.reset();
    }

    onSubmit() {
        const some = this.companyDetailsForm.value;
        console.log(some);
        // this.clientsService.addClient(some);
        localStorage.setItem('personal', JSON.stringify(some));
        this.ResetForm();
        this.stepperService.changeIndex(2);
        this.router.navigateByUrl('/clients/contact-person');
    }
}
