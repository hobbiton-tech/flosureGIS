import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-marine-cargo',
    templateUrl: './marine-cargo.component.html',
    styleUrls: ['./marine-cargo.component.scss']
})
export class MarineCargoComponent implements OnInit {
    constructor(private formBuilder: FormBuilder) {
        this.marineCargoScheduleDetailsForm = this.formBuilder.group({
            conveyance: ['', Validators.required],
            voyages: ['', Validators.required],
            subjectMatter: ['', Validators.required],
            interestValue: ['', Validators.required],
            rate: ['', Validators.required]
        });
    }

    marineCargoScheduleDetailsForm: FormGroup;

    ngOnInit(): void {}

    getMarineCargoScheduleDetails() {
        return this.marineCargoScheduleDetailsForm.value;
    }
}
