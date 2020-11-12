import { Component, OnInit } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { IRequisitionModel } from 'src/app/accounts/components/models/requisition.model';
import { v4 } from 'uuid';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { PermissionsModel } from '../../../users/models/roles.model';
import { UserModel } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';

@Component({
    selector: 'app-claims-processing',
    templateUrl: './claims-processing.component.html',
    styleUrls: ['./claims-processing.component.scss']
})
export class ClaimsProcessingComponent implements OnInit {
    isRaisingRequisition: boolean = false;

    isLossQuantumModalVisible: boolean = false;
    isClaimApprovalModalVisible: boolean = false;

    columnAlignment = 'center';
    claimProcessingIsLoading = false;

    searchPendingClaimsString: string;
    searchApprovedClaimsString: string;

  searchPendingThirdPartyClaimsString: string;
  searchApprovedThirdPartyClaimsString: string;

    claimsList: Claim[] = [];
    thirdPartyClaimList: Claim[] = [];

    processedClaimsList: Claim[] = [];
  processedThirdPartyClaimsList: Claim[] = [];
    displayProcessedClaimsList: Claim[] = [];
  displayProcessedThirdPatyClaimsList: Claim[] = [];

    pendingClaimsList: Claim[];
  pendingThirdPartyClaimsList: Claim[];
    displayPendingClaimList: Claim[] = [];
    displayPendingThirdPartyClaimList: Claim[] = [];

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
    processClaimPem = 'process_claim';
    loggedIn = localStorage.getItem('currentUser');
    claim: Claim;
     paramID: any;

    constructor(
        private readonly claimsService: ClaimsService,
        private claimProcessingService: ClaimsProcessingServiceService,
        private accountsService: AccountService,
        private msg: NzMessageService,
        private readonly router: Router,
        private usersService: UsersService,
        private activateRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.claimProcessingIsLoading = true;
      this.activateRoute.params.subscribe(param => {
        // setTimeout(() => {
        //     this.claimProcessingIsLoading = false;
        // }, 3000);

        const decodedJwtData = jwt_decode(this.loggedIn);
        console.log('Decoded>>>>>>', decodedJwtData);

        this.paramID = param.id

        this.usersService.getUsers().subscribe(users => {
            this.user = users.filter(x => x.ID === decodedJwtData.user_id)[0];

            this.isPresent = this.user.Permission.find(
                el => el.name === this.admin || el.name === this.processClaimPem
            );

            console.log('USERS>>>', this.user, this.isPresent, this.admin);
        });

       this.refresh();

        this.claimsTableUpdate.subscribe(update => {
            update === true ? this.updateClaimsTables() : '';
        });

     });
    }

    refresh() {
      this.claimsService.getClaims().subscribe(claims => {
        this.claimsList = claims.filter((x) => x.claimNumber === this.paramID && x.claimType === 'Own Damage');

        this.thirdPartyClaimList = claims.filter((x) => x.claimNumber === this.paramID && x.claimType === 'Third Party');

        console.log('Check>>>', this.claimsList);

        this.pendingClaimsList = this.claimsList.filter(
          x => x.claimStatus == 'Pending'
        );

        this.pendingThirdPartyClaimsList = this.thirdPartyClaimList.filter(
          x => x.claimStatus == 'Pending'
        );
        console.log(this.pendingClaimsList);
        this.displayPendingClaimList = this.pendingClaimsList;

        this.displayPendingThirdPartyClaimList = this.pendingThirdPartyClaimsList;

        this.processedClaimsList = this.claimsList.filter(
          x => x.claimStatus == 'Processed'
        );
        this.displayProcessedClaimsList = this.processedClaimsList;

        this.displayProcessedThirdPatyClaimsList = this.processedThirdPartyClaimsList;

        this.claimProcessingIsLoading = false;
      });
    }

    // openLossQuantumModal() {
    //     this.isLossQuantumModalVisible = true;
    // }

    openClaimApprovalModal() {
        this.isClaimApprovalModalVisible = true;
    }

    processClaim(claim: Claim) {
        this.claimProcessingService.changeClaim(claim);
        this.claim = claim;
      console.log("WHATATATATAT>>>>", this.claim);
      this.isLossQuantumModalVisible = true;
        // this.openLossQuantumModal();
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

            // this.pendingClaimsList = this.claimsList.filter(
            //     x => x.claimStatus == 'Pending'
            // );
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
        let policyRisksRegNumbers: string[] = claim.policy.risks.map(
            x => x.vehicle.regNumber
        );

        let policyRisksId: string[] = claim.policy.risks.map(
            x => x.property.propertyId
        );

        if (claim.policy.class.className.toLowerCase() == 'motor') {
            if (policyRisksRegNumbers.includes(claim.risk.vehicle.regNumber)) {
                this.isClaimRiskUnderPolicy = true;
            } else {
                this.isClaimRiskUnderPolicy = false;
            }
        }

        if (claim.policy.class.className.toLowerCase() == 'fire') {
            if (
                policyRisksRegNumbers.includes(claim.risk.property.propertyId)
            ) {
                this.isClaimRiskUnderPolicy = true;
            } else {
                this.isClaimRiskUnderPolicy = false;
            }
        }

        if (claim.policy.class.className.toLowerCase() == 'accident') {
            if (
                policyRisksRegNumbers.includes(
                    claim.risk.accidentProduct.riskProductId
                )
            ) {
                this.isClaimRiskUnderPolicy = true;
            } else {
                this.isClaimRiskUnderPolicy = false;
            }
        }

        if (claim.policy.class.className.toLowerCase() == 'marine') {
            if (
                policyRisksRegNumbers.includes(
                    claim.risk.accidentProduct.riskProductId
                )
            ) {
                this.isClaimRiskUnderPolicy = true;
            } else {
                this.isClaimRiskUnderPolicy = false;
            }
        }

        if (claim.policy.class.className.toLowerCase() == 'engineering') {
            if (
                policyRisksRegNumbers.includes(
                    claim.risk.accidentProduct.riskProductId
                )
            ) {
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

        if (
            claim.documentUploads.filter(
                x => x.documentType == 'Drivers License'
            ).length > 0 &&
            claim.documentUploads.filter(x => x.documentType == 'Claim Form')
                .length > 0
        ) {
            this.isClaimFullyDocumented = true;
        } else {
            this.isClaimFullyDocumented = false;
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
                    claim.client.firstName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    claim.client.lastName
                      .toLowerCase()
                      .includes(value.toLowerCase())
                );
            }
        });
    }

  searchPendingThirdPartyClaims(value: string) {
    if (value === '' || !value) {
      this.displayPendingThirdPartyClaimList = this.pendingThirdPartyClaimsList.filter(
        x => x.claimNumber != null
      );
    }

    this.displayPendingThirdPartyClaimList = this.pendingThirdPartyClaimsList.filter(claim => {
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
