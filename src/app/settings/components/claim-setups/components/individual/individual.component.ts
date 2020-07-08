import { Component, OnInit } from '@angular/core';
import { IIndividual } from 'src/app/settings/models/underwriting/claims.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimsService } from '../../services/claims.service';
import { v4 } from 'uuid';

@Component({
    selector: 'app-individual',
    templateUrl: './individual.component.html',
    styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit {
    individualsList: IIndividual[] = [];
    typeClass: any;
    genderClass: any;
    individualForm: FormGroup;
    isAddIndividualOpen: boolean = false;
    idType: any;

    constructor(
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService
    ) {
        this.individualForm = formBuilder.group({
            firstName: ['', Validators.required],
            middleName: [''],
            surname: ['', Validators.required],
            idNumber: ['', Validators.required],
            physicalAddress: ['', Validators.required],
            postal: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email: ['', Validators.required],
            qualifications: ['', Validators.required],
            yearsExperience: ['', Validators.required],
            gender: ['', Validators.required],
            idType: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.claimsService.getIndividuals().subscribe((res) => {
            this.individualsList = res;
        });
    }

    openAddIndividual() {
        this.isAddIndividualOpen = true;
    }

    submitForm() {
        console.log('DATA<<<<<<<', this.individualForm.value);

        const ind: IIndividual = {
            ...this.individualForm.value,
            id: v4(),
        };
        this.claimsService.addIndividual(ind);
        this.isAddIndividualOpen = false;
        this.individualForm.reset();
    }

    resetIndividualForm() {
        this.individualForm.reset();
    }
}
