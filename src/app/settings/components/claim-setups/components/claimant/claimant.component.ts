import { Component, OnInit } from '@angular/core';
import { IClaimant } from 'src/app/settings/models/underwriting/claims.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimSetupsService } from '../../services/claim-setups.service';
import { v4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
    selector: 'app-claimant',
    templateUrl: './claimant.component.html',
    styleUrls: ['./claimant.component.scss'],
})
export class ClaimantComponent implements OnInit {
    claimantsList: IClaimant[] = [];
    typeClass: any;
    genderClass;
    selectedClaimantType: any;
    claimantForm: FormGroup;
    isAddClaimantOpen: boolean = false;
    idType: any;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private claimsService: ClaimSetupsService
    ) {
        this.claimantForm = formBuilder.group({
            firstName: ['', Validators.required],
            middleName: [''],
            surname: ['', Validators.required],
            idNumber: ['', Validators.required],
            physicalAddress: ['', Validators.required],
            postal: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email: ['', Validators.required],
            gender: ['', Validators.required],
            idType: ['', Validators.required],
            claimantType: ['Third Party'],
        });
    }

    ngOnInit(): void {
        this.claimsService.getClaimants().subscribe((res) => {
            this.claimantsList = res;
        });
    }
    openAddClaimant() {
        this.isAddClaimantOpen = true;
    }

    submitForm() {
        const claimant: IClaimant = {
            ...this.claimantForm.value,
            id: v4(),
        };
        this.claimsService.addClaimant(claimant);
        this.isAddClaimantOpen = false;
        this.claimantForm.reset();
    }

    resetClaimantForm() {
        this.claimantForm.reset();
    }

    viewDetails(claimant: IClaimant) {
        this.router.navigateByUrl(
            '/flosure/settings/claimant-details/' + claimant.id
        );
    }
}
