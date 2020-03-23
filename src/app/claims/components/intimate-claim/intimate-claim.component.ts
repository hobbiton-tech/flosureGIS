import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { IClient } from 'src/app/clients/models/clients.model';
import { Claim } from '../../models/claim.model';

@Component({
    selector: 'app-intimate-claim',
    templateUrl: './intimate-claim.component.html',
    styleUrls: ['./intimate-claim.component.scss']
})
export class IntimateClaimComponent implements OnInit {
    intimateClaimForm: FormGroup;

    perilsList: any[] = [];

    constructor(
        private readonly claimService: ClaimsService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.intimateClaimForm = this.formBuilder.group({
            bookedBy: ['', Validators.required],
            policyNumber: '',
            clientName: '',
            serviceProvider: '',
            serviceType: '',
            claimDescription: '',
            risk: '',
            activity: '',
            lossDate: '',
            notificationDate: '',
            status: 'pending'
        });
    }

    // addClaim(claim: Claim): void {
    //   this.claimService.addClaim(claim)
    // }

    onSubmit() {
        console.log(this.intimateClaimForm.value);
        const claim = this.intimateClaimForm.value as Claim;
        claim.document = { url: '', name: '' };
        this.claimService.addClaim(claim);
        this.intimateClaimForm.reset();
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.intimateClaimForm.reset();
    }
}
