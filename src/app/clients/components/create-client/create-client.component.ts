import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../common/services/stepper.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-create-client',
    templateUrl: './create-client.component.html',
    styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
    clientTypeForm: FormGroup;

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.clientTypeForm = this.formBuilder.group({
            type: ['', Validators.required]
        });
    }

    get f() {
        return this.clientTypeForm.controls;
    }

    next() {
        this.stepperService.changeIndex(1);
        if (this.f.type.value === 'ind') {
            this.router.navigateByUrl('/flosure/clients/personal-details');
        } else if (this.f.type.value === 'cor') {
            this.router.navigateByUrl('/flosure/clients/company-details');
        }
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(0);
    }
}
