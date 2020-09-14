import { Component, OnInit } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { BehaviorSubject } from 'rxjs';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { PermissionsModel } from '../../../users/models/roles.model';
import { UserModel } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';

@Component({
    selector: 'app-processed-claims',
    templateUrl: './processed-claims.component.html',
    styleUrls: ['./processed-claims.component.scss']
})
export class ProcessedClaimsComponent implements OnInit {
    isRaisingRequisition: boolean = false;

    isLossQuantumModalVisible: boolean = false;
    isClaimApprovalModalVisible: boolean = false;

    columnAlignment = 'center';
    claimProcessingIsLoading = false;

    searchPendingClaimsString: string;
    searchApprovedClaimsString: string;

    claimsList: Claim[];

    processedClaimsList: Claim[];
    displayProcessedClaimsList: Claim[];

    pendingClaimsList: Claim[];
    displayPendingClaimList: Claim[];

    // Claim Approval
    isClaimRiskUnderPolicy: boolean = false;
    isClaimLossDateUnderPolicyPeriod: boolean = false;
    isClaimPolicyPremiumFullyPaid: boolean = false;
    isClaimFullyDocumented: boolean = false;

    // for modal
    lossEstimate: number;

    claimsTableUpdate = new BehaviorSubject<boolean>(false);

  permission: PermissionsModel;
  user: UserModel;
  isPresent: PermissionsModel;
  admin = 'admin';
  approveClaimPem = 'approve_claim';
  loggedIn = localStorage.getItem('currentUser');

    constructor(
        private readonly claimsService: ClaimsService,
        private claimProcessingService: ClaimsProcessingServiceService,
        private accountsService: AccountService,
        private msg: NzMessageService,
        private readonly router: Router,
        private  usersService: UsersService,
    ) {}

    ngOnInit(): void {
        this.claimProcessingIsLoading = true;
        setTimeout(() => {
            this.claimProcessingIsLoading = false;
        }, 3000);

      const decodedJwtData = jwt_decode(this.loggedIn);
      console.log('Decoded>>>>>>', decodedJwtData);

      this.usersService.getUsers().subscribe((users) => {
        this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];

        this.isPresent = this.user.Permission.find((el) => el.name === this.admin || el.name === this.approveClaimPem);

        console.log('USERS>>>', this.user, this.isPresent, this.admin);
      });

        this.claimsService.getClaims().subscribe(claims => {
            this.claimsList = claims;

            console.log(this.claimsList);

            this.pendingClaimsList = this.claimsList.filter(
                x => x.claimStatus == 'Pending'
            );
            console.log(this.pendingClaimsList);
            this.displayPendingClaimList = this.pendingClaimsList;

            this.processedClaimsList = this.claimsList.filter(
                x => x.claimStatus == 'Processed'
            );
            this.displayProcessedClaimsList = this.processedClaimsList;
        });

        this.claimsTableUpdate.subscribe(update => {
            update === true ? this.updateClaimsTables() : '';
        });
    }

    openLossQuantumModal() {
        this.isLossQuantumModalVisible = true;
    }

    openClaimApprovalModal() {
        this.isClaimApprovalModalVisible = true;
    }

    processClaim(claim: Claim) {
        this.claimProcessingService.changeClaim(claim);
        this.openLossQuantumModal();
    }

    openClaimApproval(claim: Claim) {
        this.checkClaimApproval(claim);
        this.openClaimApprovalModal();
        this.claimProcessingService.changeClaim(claim);
    }

    viewClaimDetails(claim: Claim): void {
        this.claimProcessingService.changeClaim(claim);

        this.router.navigateByUrl('/flosure/claims/claim-details/' + claim.id);
    }

    updateClaimsTables() {
        this.claimsService.getClaims().subscribe(claims => {
            this.claimsList = claims;

            console.log(this.claimsList);

            this.pendingClaimsList = this.claimsList.filter(
                x => x.claimStatus == 'Pending'
            );
            console.log(this.pendingClaimsList);
            this.displayPendingClaimList = this.pendingClaimsList.filter(
                x => x.claimant != null
            );

            this.processedClaimsList = this.claimsList.filter(
                x => x.claimStatus == 'Processed'
            );
            this.displayProcessedClaimsList = this.processedClaimsList.filter(
                x => x.claimant != null
            );
        });
    }

    checkClaimApproval(claim: Claim) {
        if (claim.policy.class.className.toLowerCase() == 'motor') {
            let policyRisksRegNumbers: string[] = claim.policy.risks.map(
                x => x.vehicle.regNumber
            );

            if (policyRisksRegNumbers.includes(claim.risk.vehicle.regNumber)) {
                this.isClaimRiskUnderPolicy = true;
            } else {
                this.isClaimRiskUnderPolicy = false;
            }
        }

        if (claim.policy.class.className.toLowerCase() == 'fire') {
            console.log('claim :=> ', claim);
            console.log('property :=> ', claim.policy);
            let policyRisksId: string[] = claim.policy.risks.map(
                x => x.property.propertyId
            );

            if (policyRisksId.includes(claim.risk.property.propertyId)) {
                this.isClaimRiskUnderPolicy = true;
            } else {
                this.isClaimRiskUnderPolicy = false;
            }
        }

        if (
            moment(claim.lossDate).isBetween(
                claim.risk.riskStartDate,
                claim.risk.riskEndDate,
                'days',
                '[]'
            )
        ) {
            this.isClaimLossDateUnderPolicyPeriod = true;
        } else {
            this.isClaimLossDateUnderPolicyPeriod = false;
        }

        if (claim.policy.receiptStatus == 'Receipted') {
            this.isClaimPolicyPremiumFullyPaid = false;
        } else {
            this.isClaimPolicyPremiumFullyPaid = true;
        }

        if (claim.policy.class.className.toLowerCase() == 'motor') {
            if (
                claim.documentUploads.filter(
                    x => x.documentType == 'Drivers License'
                ).length > 0 &&
                claim.documentUploads.filter(
                    x => x.documentType == 'Claim Form'
                ).length > 0
            ) {
                this.isClaimFullyDocumented = true;
            } else {
                this.isClaimFullyDocumented = false;
            }
        }
        if (claim.policy.class.className.toLowerCase() == 'fire') {
            if (
                claim.documentUploads.filter(
                    x => x.documentType == 'Claim Form'
                ).length > 0
            ) {
                this.isClaimFullyDocumented = true;
            } else {
                this.isClaimFullyDocumented = false;
            }
        }
    }

    searchPendingClaims(value: string) {
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
                    claim.claimant.firstName
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
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
                        claim.claimant.firstName
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    );
                }
            }
        );
    }
}
