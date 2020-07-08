import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimsService } from '../../services/claims.service';
import { ILossAdjustor } from 'src/app/settings/models/underwriting/claims.model';
import { v4 } from 'uuid';

@Component({
    selector: 'app-loss-adjustor',
    templateUrl: './loss-adjustor.component.html',
    styleUrls: ['./loss-adjustor.component.scss'],
})
export class LossAdjustorComponent implements OnInit {
    lossAdjustorsList: ILossAdjustor[] = [];
    providerType: any;
    typeClass: any;
    lossAdjustorForm: FormGroup;
    isAddLossAdjustorOpen: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService
    ) {
        this.lossAdjustorForm = formBuilder.group({
            companyName: ['', Validators.required],
            lossAdjustorType: [null, Validators.required],
            physicalAddress: ['', Validators.required],
            postal: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email: ['', Validators.required],
            repName: ['', Validators.required],
            repNumber: ['', Validators.required],
            repEmail: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.claimsService.getLossAdjustors().subscribe((res) => {
            this.lossAdjustorsList = res;
        });
    }

    openAddLossAdjustor() {
        this.isAddLossAdjustorOpen = true;
    }

    submitForm() {
        const serviceProvider: ILossAdjustor = {
            ...this.lossAdjustorForm.value,
            id: v4(),
            serviceProviderType: this.providerType,
        };
        this.claimsService.addLossAdjustor(serviceProvider);
        this.isAddLossAdjustorOpen = false;
        this.lossAdjustorForm.reset();
    }

    resetForm() {
        this.lossAdjustorForm.reset();
    }

    onChange(value) {
        this.providerType = value;
    }
}
