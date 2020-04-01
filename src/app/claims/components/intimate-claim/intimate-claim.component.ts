import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims.service';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Claim } from '../../models/claim.model';
import { ICorporateClient } from 'src/app/clients/models/clients.model';

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
            policyNumber: ['', Validators.required],
            clientName: ['', Validators.required],
            serviceProvider: ['', Validators.required],
            serviceType: ['', Validators.required],
            claimDescription: ['', Validators.required],
            risk: ['', Validators.required],
            activity: ['', Validators.required],
            lossDate: ['', Validators.required],
            notificationDate: ['', Validators.required],
            status: 'pending'
        });
    }

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
