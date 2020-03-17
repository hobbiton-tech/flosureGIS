import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Client } from 'src/app/clients/models/clients.model';
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
  ) { }

  ngOnInit(): void {
    this.intimateClaimForm = this.formBuilder.group({
      bookedBy: '',
      claimID: '',
      riskID: '',
      policyNumber: '',
      clientName: '',
      serviceProvider: '',
      serviceType: '',
      claimDescription: '',
      risk: '',
      activity: '',
      lossDate: '',
      notificationDate: ''
    })
  }

  // addClaim(claim: Claim): void {
  //   this.claimService.addClaim(claim)
  // }

  onSubmit() {
    const claim = this.intimateClaimForm.value;
    this.claimService.addClaim(claim);
  }

}
