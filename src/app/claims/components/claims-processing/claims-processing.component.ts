import { Component, OnInit } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { IRequisitionModel } from 'src/app/accounts/components/models/requisition.model';
import { v4 } from 'uuid';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';

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

    // requisition number
    reqNumber: string;
    displayApprovedClaimsList: Claim[];

    constructor(
        private readonly claimsService: ClaimsService,
        private claimProcessingService: ClaimsProcessingServiceService,
        private accountsService: AccountService,
        private msg: NzMessageService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.claimProcessingIsLoading = true;
        setTimeout(() => {
            this.claimProcessingIsLoading = false;
        }, 3000);

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
