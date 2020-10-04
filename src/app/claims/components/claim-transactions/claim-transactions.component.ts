import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import * as jwt_decode from 'jwt-decode';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PermissionsModel } from '../../../users/models/roles.model';
import { UserModel } from '../../../users/models/users.model';
import { PoliciesService } from '../../../underwriting/services/policies.service';
import { UsersService } from '../../../users/services/users.service';

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss']
})
export class ClaimTransactionsComponent implements OnInit {
    columnAlignment = 'center';
    claimsListIsLoading = false;

    claimsList: Claim[];
    displayClaimsList: Claim[];
    claimsCount: number = 0;

    searchString: string;

    //spin feedback when loading figures
    claimsLoading: boolean = true;
    permission: PermissionsModel;
    user: UserModel;
    isPresent: PermissionsModel;
    admin = 'admin';
    intimateCliam = 'intimate_claim';
    loggedIn = localStorage.getItem('currentUser');

    constructor(
        private readonly route: Router,
        private readonly claimsService: ClaimsService,
        private readonly claimsProcessingService: ClaimsProcessingServiceService,
        private usersService: UsersService
    ) {}

    viewClaimDetails(claim: Claim): void {
        this.claimsProcessingService.changeClaim(claim);

        this.route.navigateByUrl('/flosure/claims/claim-details/' + claim.id);
    }

    async addClaim(claim: Claim): Promise<void> {}

    ngOnInit(): void {
        this.claimsListIsLoading = true;
        // setTimeout(() => {
        //     this.claimsListIsLoading = false;
        // }, 3000);

        const decodedJwtData = jwt_decode(this.loggedIn);
        console.log('Decoded>>>>>>', decodedJwtData);

        this.usersService.getUsers().subscribe(users => {
            this.user = users.filter(x => x.ID === decodedJwtData.user_id)[0];

            this.isPresent = this.user.Permission.find(
                el => el.name === this.admin || el.name === this.intimateCliam
            );

            console.log('USERS>>>', this.user, this.isPresent, this.admin);
        });

        this.claimsService.getClaims().subscribe(claims => {
            this.claimsCount = claims.length;
            this.claimsLoading = false;
            this.claimsList = claims;
            console.log(claims);

            this.displayClaimsList = this.claimsList.filter(
                x => x.claimNumber != null
            );

            this.claimsListIsLoading = false;
        });
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayClaimsList = this.claimsList.filter(
                x => x.claimNumber != null
            );
        }

        this.displayClaimsList = this.claimsList.filter(claim => {
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
                    claim.claimant.firstName
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
}
