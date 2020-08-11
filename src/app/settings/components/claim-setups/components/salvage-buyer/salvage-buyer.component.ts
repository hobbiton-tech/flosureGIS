import { Component, OnInit } from '@angular/core';
import { ISalvageBuyer } from 'src/app/settings/models/underwriting/claims.model';
import { v4 } from 'uuid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimSetupsService } from '../../services/claim-setups.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-salvage-buyer',
    templateUrl: './salvage-buyer.component.html',
    styleUrls: ['./salvage-buyer.component.scss'],
})
export class SalvageBuyerComponent implements OnInit {
    salvageBuyersList: ISalvageBuyer[] = [];
    typeClass: any;
    genderClass;
    salvageBuyerForm: FormGroup;
    isAddSalvageBuyerOpen: boolean = false;
    idType: any;

    constructor(
        private router: Router,
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
        this.claimsService.getSalvageBuyers().subscribe((res) => {
            this.salvageBuyersList = res;
        });
    }

    openAddSalvageBuyer() {
        this.isAddSalvageBuyerOpen = true;
    }

    submitForm() {
        const salvageBuyer: ISalvageBuyer = {
            ...this.salvageBuyerForm.value,
            id: v4(),
        };
        this.claimsService.addSalvageBuyer(salvageBuyer);
        this.isAddSalvageBuyerOpen = false;
        this.salvageBuyerForm.reset();
    }

    resetForm() {
        this.salvageBuyerForm.reset();
    }

    viewDetails(salvageBuyer: ISalvageBuyer) {
        this.router.navigateByUrl(
            '/flosure/settings/salvage-buyer-details/' + salvageBuyer.id
        );
    }
}
