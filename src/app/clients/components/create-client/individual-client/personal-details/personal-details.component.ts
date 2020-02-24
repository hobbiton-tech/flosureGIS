import { Component, OnInit } from '@angular/core';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.component.html',
    styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
    // Declarations
    personalDetailsForm: FormGroup;
    // title values
    listOfOption = ['Mr', 'Mrs', 'Dr', 'Prof'];
    listOfSelectedValue: string[] = [];

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.personalDetailsForm = this.formBuilder.group({
            title: ['', Validators.required],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', Validators.required],
            address: ['', Validators.required],
            phone_number: ['', Validators.required],
            gender: ['', Validators.required],
            dob: ['', Validators.required]
        });
    }

    get f() {
        return this.personalDetailsForm.controls;
    }

    onSubmit() {
        this.stepperService.changeIndex(2);
        this.router.navigateByUrl('/employement-information');
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(1);
    }
}
