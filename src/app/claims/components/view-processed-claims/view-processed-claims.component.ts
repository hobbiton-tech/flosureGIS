import { Component, OnInit } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AccountService } from '../../../accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-processed-claims',
  templateUrl: './view-processed-claims.component.html',
  styleUrls: ['./view-processed-claims.component.scss']
})
export class ViewProcessedClaimsComponent implements OnInit {

  columnAlignment = 'center';

  claimsList: Claim[];

  processedClaimsList: Claim[];
  displayProcessedClaimsList: Claim[];
  claimProcessingIsLoading = true;
  searchApprovedClaimsString: string;

  constructor(
    private readonly claimsService: ClaimsService,
    private claimProcessingService: ClaimsProcessingServiceService,
    private accountsService: AccountService,
    private msg: NzMessageService,
    private readonly route: Router,
  ) { }

  ngOnInit(): void {
    this.claimsService.getClaims().subscribe(claims => {
      this.claimsList = claims;

      this.processedClaimsList = this.claimsList.filter(
        x => x.claimType === 'Own Damage'
      );
      this.displayProcessedClaimsList = this.processedClaimsList;

      this.claimProcessingIsLoading = false;
    });
  }


  searchApprovedClaims(value: string) {
    if (value === '' || !value) {
      this.displayProcessedClaimsList = this.processedClaimsList.filter(
        x => x.claimNumber != null
      );
    }

    this.displayProcessedClaimsList = this.processedClaimsList.filter(
      claim => {
        if (claim.claimNumber != null) {
          return (
            claim.claimNumber
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.policy.policyNumber
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.claimStatus
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.client.firstName
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.client.lastName
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
      }
    );
  }

  viewProcessedClaimDetails(claim: Claim) {
    this.route.navigateByUrl('/flosure/claims/processed-claims/' + claim.claimNumber);
  }
}
