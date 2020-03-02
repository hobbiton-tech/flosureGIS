import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employement-information',
    templateUrl: './employement-information.component.html',
    styleUrls: ['./employement-information.component.scss']
})
export class EmployementInformationComponent implements OnInit {
    // Declarations
    employementInformationForm: FormGroup;

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
        this.employementInformationForm = this.formBuilder.group({
            sector: ['', Validators.required],
            occupation: ['', Validators.required]
        });
    }

    get f() {
        return this.employementInformationForm.controls;
    }

    onSubmit() {
        this.stepperService.changeIndex(3);
        this.router.navigateByUrl('/clients/bank-details');
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(2);
    }
}
