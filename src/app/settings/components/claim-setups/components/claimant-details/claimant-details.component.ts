import { Component, OnInit } from '@angular/core';
import { IClaimant } from 'src/app/settings/models/underwriting/claims.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimSetupsService } from '../../services/claim-setups.service';

@Component({
    selector: 'app-claimant-details',
    templateUrl: './claimant-details.component.html',
    styleUrls: ['./claimant-details.component.scss'],
})
export class ClaimantDetailsComponent implements OnInit {
    isEditMode: boolean = false;
    claimant: IClaimant;
    claimantForm: FormGroup;
    selectedGender: string;
    selectedClaimantType: string;
    selectedIdType: string;
    name: string;
    id: string;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
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
            claimantType: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.router.params.subscribe((param) => {
            this.id = param.id;
        });

        this.claimsService.getClaimants().subscribe((claimants) => {
            this.claimant = claimants.filter(
                (x) => x.id === this.id
            )[0] as IClaimant;

            this.name = `${this.claimant.firstName} ${this.claimant.surname}`;
            this.selectedClaimantType = this.claimant.claimantType;
            this.selectedGender = this.claimant.gender;
            this.selectedIdType = this.claimant.idType;

            this.claimantForm.controls['firstName'].setValue(
                this.claimant.firstName
            );
            this.claimantForm.controls['middleName'].setValue(
                this.claimant.middleName
            );
            this.claimantForm.controls['surname'].setValue(
                this.claimant.surname
            );
            this.claimantForm.controls['idNumber'].setValue(
                this.claimant.idNumber
            );
            this.claimantForm.controls['physicalAddress'].setValue(
                this.claimant.physicalAddress
            );
            this.claimantForm.controls['postal'].setValue(this.claimant.postal);
            this.claimantForm.controls['phoneNumber'].setValue(
                this.claimant.phoneNumber
            );
            this.claimantForm.controls['email'].setValue(this.claimant.email);
        });
    }

    goBack() {
        this.route.navigateByUrl('/flosure/settings/claims');
    }
}
