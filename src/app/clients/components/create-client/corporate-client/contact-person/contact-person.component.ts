import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-contact-person',
    templateUrl: './contact-person.component.html',
    styleUrls: ['./contact-person.component.scss']
})
export class ContactPersonComponent implements OnInit {
    // Declarations
    contactPersornForm: FormGroup;


    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.contactPersornForm = this.formBuilder.group({
            contact_first_name: ['', Validators.required],
            contact_last_name: ['', Validators.required],
            contact_email: ['', Validators.required]
        });
    }

    get f() {
        return this.contactPersornForm.controls;
    }

    onSubmit() {
        this.stepperService.changeIndex(3);
        this.router.navigateByUrl('/clients/company-bank-details');
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(2);
    }
}
