import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimSetupsService } from '../../services/claim-setups.service';
import {
    ILossAdjustor,
    IIndividual,
} from 'src/app/settings/models/underwriting/claims.model';
import { v4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
    selector: 'app-loss-adjustor',
    templateUrl: './loss-adjustor.component.html',
    styleUrls: ['./loss-adjustor.component.scss'],
})
export class LossAdjustorComponent implements OnInit {
    lossAdjustorsList: Array<IIndividual & ILossAdjustor>;

    selectedType: string;
    corporateForm: FormGroup;
    isAddLossAdjustorOpen: boolean = false;

    typeClass: any;
    genderClass: any;
    individualForm: FormGroup;
    idType: any;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private claimsService: ClaimSetupsService
    ) {
        this.corporateForm = formBuilder.group({
            name: ['', Validators.required],
            physicalAddress: ['', Validators.required],
            postal: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email: ['', Validators.required],
            repName: ['', Validators.required],
            repNumber: ['', Validators.required],
            repEmail: ['', Validators.required],
        });

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
        this.claimsService.getAllLossAdjustors().subscribe((lossAdjustors) => {
            this.lossAdjustorsList = [
                ...lossAdjustors[0],
                ...lossAdjustors[1],
            ] as Array<IIndividual & ILossAdjustor>;
        });
    }

    openAddLossAdjustor() {
        this.isAddLossAdjustorOpen = true;
    }

    submitCorporateForm() {
        const companyLossAdjustor: ILossAdjustor = {
            ...this.corporateForm.value,
            id: v4(),
            lossAdjustorType: this.selectedType,
        };
        this.claimsService.addLossAdjustor(companyLossAdjustor);
        this.isAddLossAdjustorOpen = false;
        this.corporateForm.reset();
    }

    submitIndividualForm() {
        const individual: IIndividual = {
            ...this.individualForm.value,
            id: v4(),
            lossAdjustorType: this.selectedType,
            name: `${this.individualForm.value.firstName} ${this.individualForm.value.surname}`,
        };
        this.claimsService.addIndividual(individual);
        this.isAddLossAdjustorOpen = false;
        this.individualForm.reset();
    }

    resetCorporateForm() {
        this.corporateForm.reset();
    }

    resetIndividualForm() {
        this.individualForm.reset();
    }

    viewDetails(lossAdjustor: IIndividual | ILossAdjustor) {
        this.router.navigateByUrl(
            '/flosure/settings/loss-adjustor-details/' + lossAdjustor.id
        );
    }
}
