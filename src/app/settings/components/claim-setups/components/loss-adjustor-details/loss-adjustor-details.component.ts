import { Component, OnInit } from '@angular/core';
import {
    IIndividual,
    ILossAdjustor,
} from 'src/app/settings/models/underwriting/claims.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimSetupsService } from '../../services/claim-setups.service';
import { name } from 'faker';

@Component({
    selector: 'app-loss-adjustor-details',
    templateUrl: './loss-adjustor-details.component.html',
    styleUrls: ['./loss-adjustor-details.component.scss'],
})
export class LossAdjustorDetailsComponent implements OnInit {
    isEditmode: boolean = false;
    lossAdjustor: IIndividual & ILossAdjustor;

    individualForm: FormGroup;
    corporateForm: FormGroup;

    id: string;
    genderClass: string;
    typeClass: string;
    laType: string;
    name: string;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
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
        this.router.params.subscribe((param) => {
            this.id = param.id;
        });

        this.claimsService.getAllLossAdjustors().subscribe((lossAdjustors) => {
            this.lossAdjustor = [
                ...lossAdjustors[0],
                ...lossAdjustors[1],
            ].filter((x) => x.id === this.id)[0] as IIndividual & ILossAdjustor;

            this.laType = this.lossAdjustor.lossAdjustorType;
            if (this.lossAdjustor.lossAdjustorType == 'individual') {
                this.name = `${this.lossAdjustor.firstName} ${this.lossAdjustor.surname}`;

                this.individualForm.controls['firstName'].setValue(
                    this.lossAdjustor.firstName
                );
                this.individualForm.controls['middleName'].setValue(
                    this.lossAdjustor.middleName
                );
                this.individualForm.controls['surname'].setValue(
                    this.lossAdjustor.surname
                );
                this.typeClass = this.lossAdjustor.idType;

                this.individualForm.controls['idNumber'].setValue(
                    this.lossAdjustor.idNumber
                );
                this.genderClass = this.lossAdjustor.gender;
                this.individualForm.controls['physicalAddress'].setValue(
                    this.lossAdjustor.physicalAddress
                );
                this.individualForm.controls['postal'].setValue(
                    this.lossAdjustor.postal
                );
                this.individualForm.controls['phoneNumber'].setValue(
                    this.lossAdjustor.phoneNumber
                );
                this.individualForm.controls['email'].setValue(
                    this.lossAdjustor.email
                );
                this.individualForm.controls['qualifications'].setValue(
                    this.lossAdjustor.qualifications
                );
                this.individualForm.controls['yearsExperience'].setValue(
                    this.lossAdjustor.yearsExperience
                );
            }

            if (this.lossAdjustor.lossAdjustorType == 'corporate') {
                this.name = this.lossAdjustor.name;
                this.corporateForm.controls['name'].setValue(
                    this.lossAdjustor.name
                );
                this.corporateForm.controls['physicalAddress'].setValue(
                    this.lossAdjustor.physicalAddress
                );
                this.corporateForm.controls['postal'].setValue(
                    this.lossAdjustor.postal
                );
                this.corporateForm.controls['phoneNumber'].setValue(
                    this.lossAdjustor.phoneNumber
                );
                this.corporateForm.controls['email'].setValue(
                    this.lossAdjustor.email
                );
                this.corporateForm.controls['repName'].setValue(
                    this.lossAdjustor.repName
                );
                this.corporateForm.controls['repNumber'].setValue(
                    this.lossAdjustor.repNumber
                );
                this.corporateForm.controls['repEmail'].setValue(
                    this.lossAdjustor.repEmail
                );
            }
        });
    }

    goToLossAdjustorList() {
        this.route.navigateByUrl('/flosure/settings/claims');
    }

    updateDetails() {
        if (this.lossAdjustor.lossAdjustorType == 'individual') {
            const newIndividual: IIndividual = {
                ...this.individualForm.value,
                id: this.lossAdjustor.id,
            };
            this.claimsService.updateIndividual(newIndividual);
            this.isEditmode = false;
        }
        if (this.lossAdjustor.lossAdjustorType == 'corporate') {
            const newCompany: ILossAdjustor = {
                ...this.corporateForm.value,
                id: this.lossAdjustor.id,
            };
            this.claimsService.updateLossAdjustor(newCompany);
            this.isEditmode = false;
        }
    }
}
