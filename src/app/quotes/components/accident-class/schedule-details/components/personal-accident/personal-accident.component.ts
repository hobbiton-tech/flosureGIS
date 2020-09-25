import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-personal-accident',
    templateUrl: './personal-accident.component.html',
    styleUrls: ['./personal-accident.component.scss']
})
export class PersonalAccidentComponent implements OnInit {
    constructor(private formBuilder: FormBuilder) {
        this.personalAccidentScheduleDetailsForm = this.formBuilder.group({
            personsInsured: ['', Validators.required],
            aggregateGroupLimit: ['', Validators.required],
            limitPerPerson: ['', Validators.required],
            itemNumber: ['', Validators.required],
            benefits: ['', Validators.required]
        });
    }

    personalAccidentScheduleDetailsForm: FormGroup;

    ngOnInit(): void {}

    getPersonalAccidentScheduleDetails() {
        return this.personalAccidentScheduleDetailsForm.value;
    }
}
