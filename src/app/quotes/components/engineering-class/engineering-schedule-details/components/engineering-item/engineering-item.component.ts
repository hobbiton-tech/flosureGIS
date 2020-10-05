import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-engineering-item',
    templateUrl: './engineering-item.component.html',
    styleUrls: ['./engineering-item.component.scss']
})
export class EngineeringItemComponent implements OnInit {
    constructor(private formBuilder: FormBuilder) {
        this.engineeringItemDetailsForm = this.formBuilder.group({
            group: ['', Validators.required],
            rowNumber: ['', Validators.required],
            shortDescription: ['', Validators.required],
            description: ['', Validators.required],
            limitAmount: ['', Validators.required],
            premiumRate: ['', Validators.required],
            divFactor: ['', Validators.required],
            rateType: ['', Validators.required],
            freeLimit: ['', Validators.required],
            muiltiplierRate: ['', Validators.required],
            multiplierDivisionFactor: ['', Validators.required]
        });
    }

    engineeringItemDetailsForm: FormGroup;

    ngOnInit(): void {}

    getEngineeringItemScheduleDetails() {
        return this.engineeringItemDetailsForm.value;
    }
}
