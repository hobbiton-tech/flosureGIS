import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';

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
            bookedBy: '',
            claimID: '',
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
        const claim = this.intimateClaimForm.value;
        this.claimService.addClaim(claim);
    }
}
