import { Component, OnInit } from '@angular/core';
import { ISalvageBuyer } from 'src/app/settings/models/underwriting/claims.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimSetupsService } from '../../services/claim-setups.service';

@Component({
    selector: 'app-salvage-buyer-details',
    templateUrl: './salvage-buyer-details.component.html',
    styleUrls: ['./salvage-buyer-details.component.scss'],
})
export class SalvageBuyerDetailsComponent implements OnInit {
    isEditMode: boolean = false;
    salvageBuyer: ISalvageBuyer;
    salvageBuyerForm: FormGroup;
    selectedGender: string;
    selectedIdType: string;
    name: string;
    id: string;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
        private formBuilder: FormBuilder,
        private claimsService: ClaimSetupsService
    ) {
        this.salvageBuyerForm = formBuilder.group({
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
        });
    }

    ngOnInit(): void {
        this.router.params.subscribe((param) => {
            this.id = param.id;
        });

        this.claimsService.getSalvageBuyers().subscribe((salvageBuyers) => {
            this.salvageBuyer = salvageBuyers.filter(
                (x) => x.id === this.id
            )[0] as ISalvageBuyer;

            this.name = `${this.salvageBuyer.firstName} ${this.salvageBuyer.surname}`;
            this.selectedGender = this.salvageBuyer.gender;
            this.selectedIdType = this.salvageBuyer.idType;

            this.salvageBuyerForm.controls['firstName'].setValue(
                this.salvageBuyer.firstName
            );
            this.salvageBuyerForm.controls['middleName'].setValue(
                this.salvageBuyer.middleName
            );
            this.salvageBuyerForm.controls['surname'].setValue(
                this.salvageBuyer.surname
            );
            this.salvageBuyerForm.controls['idNumber'].setValue(
                this.salvageBuyer.idNumber
            );
            this.salvageBuyerForm.controls['physicalAddress'].setValue(
                this.salvageBuyer.physicalAddress
            );
            this.salvageBuyerForm.controls['postal'].setValue(
                this.salvageBuyer.postal
            );
            this.salvageBuyerForm.controls['phoneNumber'].setValue(
                this.salvageBuyer.phoneNumber
            );
            this.salvageBuyerForm.controls['email'].setValue(
                this.salvageBuyer.email
            );
        });
    }

    goBack() {
        this.route.navigateByUrl('/flosure/settings/claims');
    }

    updateDetails() {
        const newSB: ISalvageBuyer = {
            ...this.salvageBuyerForm.value,
            id: this.salvageBuyer.id,
        };
        this.claimsService.updateSalvageBuyer(newSB);
        this.isEditMode = false;
    }
}
