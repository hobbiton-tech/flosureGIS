import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';

@Component({
  selector: 'app-damage-type',
  templateUrl: './damage-type.component.html',
  styleUrls: ['./damage-type.component.scss']
})
export class DamageTypeComponent implements OnInit {

  claimsLoading = true;
  public ownDamageList: Claim[] = [];
  public ownDamageListIsLoading = true;
  public displayOwnDamageList: Claim[] = [];
  public displaythirdPartyList: Claim[] = [];
  public thirdPartyList: Claim[] = [];
  columnAlignment = 'center';
  searchStringOwnDamage: string;
  searchStringThirdParty: string;


  constructor(
    private readonly route: Router,
    private router: ActivatedRoute,
    private readonly claimsService: ClaimsService,
    private readonly claimsProcessingService: ClaimsProcessingServiceService,
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe(param => {
      this.claimsService.getClaims().subscribe(claims => {
        this.claimsLoading = false;
        this.ownDamageList = claims.filter((x) => x.claimNumber === param.id && x.claimType === 'Own Damage');
        console.log(claims);

        this.displayOwnDamageList = this.ownDamageList;


        this.thirdPartyList = claims.filter((x) => x.claimNumber === param.id && x.claimType === 'Third Party');
        console.log(claims);

        this.displaythirdPartyList = this.thirdPartyList;

        this.ownDamageListIsLoading = false;
      });
    });
  }


  searchOwnDamage(value: string): void {
    if (value === '' || !value) {
      this.displayOwnDamageList = this.ownDamageList.filter(
        x => x.claimNumber != null
      );
    }

    this.displayOwnDamageList = this.ownDamageList.filter(claim => {
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
            .includes(value.toLowerCase()) ||
          claim.lossDate
            .toLocaleString()
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });
  }

  searchThirdParty(value: string): void {
    if (value === '' || !value) {
      this.displaythirdPartyList = this.thirdPartyList.filter(
        x => x.claimNumber != null
      );
    }

    this.displaythirdPartyList = this.thirdPartyList.filter(claim => {
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
          claim.thirdPartyDetails.firstName
            .toLowerCase()
            .includes(value.toLowerCase()) ||

          claim.thirdPartyDetails.lastName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          claim.lossDate
            .toLocaleString()
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });
  }


  viewClaimDetails(claim: Claim): void {
    this.claimsProcessingService.changeClaim(claim);

    this.route.navigateByUrl('/flosure/claims/claim-details/' + claim.id);
  }

}
