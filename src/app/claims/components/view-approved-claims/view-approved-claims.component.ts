import { Component, OnInit } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AccountService } from '../../../accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-approved-claims',
  templateUrl: './view-approved-claims.component.html',
  styleUrls: ['./view-approved-claims.component.scss']
})
export class ViewApprovedClaimsComponent implements OnInit {
  columnAlignment = 'center';

  approvedClaimsList: Claim[];
  displayApprovedClaimsList: Claim[];

  searchPendingClaimsString: string;
  searchApprovedClaimsString: string;
  claimsList: Claim[];
  claimApprovalIsLoading = true;

  constructor(
    private readonly claimsService: ClaimsService,
    private accountsService: AccountService,
    private msg: NzMessageService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.claimsService.getClaims().subscribe(claims => {
      this.claimsList = claims;

      this.approvedClaimsList = this.claimsList.filter(
        x => x.claimType === 'Own Damage'
      );
      this.displayApprovedClaimsList = this.approvedClaimsList.filter(
        x => x.claimNumber != null && x.isRequisitionRaised == false
      );
      this.claimApprovalIsLoading = false;
    });
  }

  searchApprovedClaims(value: string) {
    if (value === '' || !value) {
      this.displayApprovedClaimsList = this.approvedClaimsList.filter(
        x => x.claimNumber != null && x.isRequisitionRaised == false
      );
    }

    this.displayApprovedClaimsList = this.approvedClaimsList.filter(
      claim => {
        if (
          claim.claimNumber != null &&
          claim.isRequisitionRaised == false
        ) {
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
            claim.client.firstName
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
      }
    );
  }

  viewApprovedClaimDetails(claim: Claim): void {

    this.router.navigateByUrl('/flosure/claims/claim-approval/' + claim.claimNumber);
  }

}
