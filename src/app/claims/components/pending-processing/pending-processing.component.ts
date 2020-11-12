import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AccountService } from '../../../accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { PermissionsModel } from '../../../users/models/roles.model';
import { UserModel } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-pending-processing',
  templateUrl: './pending-processing.component.html',
  styleUrls: ['./pending-processing.component.scss']
})
export class PendingProcessingComponent implements OnInit {

  columnAlignment = 'center';

  permission: PermissionsModel;
  user: UserModel;
  isPresent: PermissionsModel;
  admin = 'admin';
  processClaimPem = 'process_claim';
  loggedIn = localStorage.getItem('currentUser');
  pendingProcessingIsLoading = false;
  claimsList: Claim[] = [];
  pendingClaimsList: Claim[] = [];
  displayPendingClaimList: Claim[] = [];
  processedClaimsList: Claim[] = [];
  displayProcessedClaimsList: Claim[] = [];
  searchString: string;

  constructor(
    private readonly claimsService: ClaimsService,
    private claimProcessingService: ClaimsProcessingServiceService,
    private accountsService: AccountService,
    private msg: NzMessageService,
    private readonly router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.pendingProcessingIsLoading = true;
    const decodedJwtData = jwt_decode(this.loggedIn);

    this.usersService.getUsers().subscribe(users => {
      this.user = users.filter(x => x.ID === decodedJwtData.user_id)[0];

      this.isPresent = this.user.Permission.find(
        el => el.name === this.admin || el.name === this.processClaimPem
      );

      console.log('USERS>>>', this.user, this.isPresent, this.admin);
    });


    this.claimsService.getClaims().subscribe(claims => {
      this.claimsList = claims.filter((x) => x.claimType === 'Own Damage');

      console.log(this.claimsList);

      this.pendingClaimsList = this.claimsList
      console.log(this.pendingClaimsList);
      this.displayPendingClaimList = this.pendingClaimsList;

      this.processedClaimsList = this.claimsList.filter(
        x => x.claimStatus == 'Processed'
      );
      this.displayProcessedClaimsList = this.processedClaimsList;

      this.pendingProcessingIsLoading = false;
    });
  }


  search(value: string): void {
    if (value === '' || !value) {
      this.displayPendingClaimList = this.pendingClaimsList.filter(
        x => x.claimNumber != null
      );
    }

    this.displayPendingClaimList = this.pendingClaimsList.filter(claim => {
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



  viewPendingProcessingClaims(claim: Claim) {
    this.router.navigateByUrl('/flosure/claims/claims-processing/' + claim.claimNumber);
  }
}
