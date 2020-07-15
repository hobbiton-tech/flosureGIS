import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Claim } from '../../models/claim.model';
import { Router } from '@angular/router';
import { v4 } from 'uuid';
import { IClaimant } from 'src/app/settings/models/underwriting/claims.model';
import { ClaimSetupsService } from 'src/app/settings/components/claim-setups/services/claim-setups.service';
import { IPeril } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import {
    IIndividualClient,
    ICorporateClient,
} from 'src/app/clients/models/clients.model';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { AddPerilService } from 'src/app/settings/components/product-setups/components/add-peril/services/add-peril.service';

@Component({
    selector: 'app-intimate-claim',
    templateUrl: './intimate-claim.component.html',
    styleUrls: ['./intimate-claim.component.scss'],
})
export class IntimateClaimComponent implements OnInit {
    intimateClaimForm: FormGroup;
    claimantForm: FormGroup;

    selectedClaimant: IClaimant;
    selectedClaimantType: string = 'Insured';
    claimantList: IClaimant[] = [];

    policiesList: Policy[];
    currentPolicy: Policy;

    perilsList: IPeril[] = [];
    selectedPerilsValue: IPeril[] = [];
    perilIds: string[] = [];

    atFault: string;

    displayClientList: Array<IIndividualClient & ICorporateClient>;
    clientList: Array<IIndividualClient & ICorporateClient>;

    riskList: RiskModel[];

    isAddClaimantVisible: boolean = false;

    constructor(
        private readonly route: Router,
        private readonly claimService: ClaimsService,
        private readonly claimSetupsService: ClaimSetupsService,
        private readonly clientsService: ClientsService,
        private readonly policiesService: PoliciesService,
        private readonly perilsService: AddPerilService,
        private formBuilder: FormBuilder
    ) {
        this.intimateClaimForm = this.formBuilder.group({
            claimantId: [''],
            clientId: ['', Validators.required],
            claimantType: ['', Validators.required],
            lossLocation: ['', Validators.required],
            lossEstimate: ['', Validators.required],
            lossDate: ['', Validators.required],
            tpFault: ['', Validators.required],
            tpInsured: [''],
            policyNumber: ['', Validators.required],
            claimDescription: ['', Validators.required],
            notificationDate: ['', Validators.required],
            riskId: ['', Validators.required],
            causation: ['', Validators.required],
        });

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
        this.claimSetupsService.getClaimants().subscribe((claimants) => {
            this.claimantList = claimants;
        });

        this.clientsService.getAllClients().subscribe((clients) => {
            this.clientList = [...clients[0], ...clients[1]] as Array<
                ICorporateClient & IIndividualClient
            >;
            this.displayClientList = this.clientList;
        });

        this.policiesService.getPolicies().subscribe((policies) => {
            this.policiesList = policies;
            // console.log('All Policies: ', this.policiesList);
        });

        this.perilsService.getPerils().subscribe((perils) => {
            this.perilsList = perils;
        });
    }

    onSubmit() {
        for (const peril of this.selectedPerilsValue) {
            this.perilIds.push(peril.id);
        }

        const claim: Claim = {
            ...this.intimateClaimForm.value,
            id: v4(),
            perils: this.perilIds,
        };
        this.claimService.addClaim(claim);
        this.intimateClaimForm.reset();
        this.selectedPerilsValue = [];
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.intimateClaimForm.reset();
    }

    submitClaimantForm() {
        const claimant: IClaimant = {
            ...this.claimantForm.value,
            id: v4(),
        };
        this.claimSetupsService.addClaimant(claimant);
        this.isAddClaimantVisible = false;
        this.claimantForm.reset();
    }

    resetClaimantForm() {
        this.claimantForm.reset();
    }

    backToTransactions() {
        this.route.navigateByUrl('/flosure/claims/claim-transactions');
    }
    capitalize(s) {
        return s.toLowerCase().replace(/\b./g, function (a) {
            return a.toUpperCase();
        });
    }

    onClientChange(value) {
        // Clear current
        this.intimateClaimForm.controls['policyNumber'].setValue('');
        this.riskList = [];
        // Set a value
        this.currentPolicy = this.policiesList.filter(
            (x) => x.clientCode === value
        )[0] as Policy;
        this.intimateClaimForm.controls['policyNumber'].setValue(
            this.currentPolicy.policyNumber
        );
        this.riskList = this.currentPolicy.risks;
    }

    claimantTypeChange(value) {
        this.selectedClaimantType = value;
    }

    onTPInvolvementChange(value) {
        this.atFault = value;
    }

    onChange() {}
}
