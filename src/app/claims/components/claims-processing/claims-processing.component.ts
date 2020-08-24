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

    claimsTableUpdate = new BehaviorSubject<boolean>(false);

    // requisition number
    reqNumber: string;

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
                x => x.claimStatus == 'Processed' || 'Approved'
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

    raiseRequisition(claim: Claim) {
        this.isRaisingRequisition = true;
        console.log(claim);
        this.accountsService.getRequisitions().subscribe(requisitions => {
            this.reqNumber = this.accountsService.generateRequisitionID(
                requisitions.length
            );

            const requisition: IRequisitionModel = {
                id: v4(),
                policyNumber: claim.policy.policyNumber,
                requisitionNumber: this.reqNumber,
                payee: claim.claimant.firstName + ' ' + claim.claimant.lastName,
                cancellationDate: claim.notificationDate,
                dateCreated: new Date(),
                approvalStatus: 'Pending',
                paymentType: 'GIS-CLAIM',
                currency: claim.policy.currency,
                amount: claim.lossQuantum.adjustedQuantum,
                paymentStatus: 'UnProcessed',
                claim: claim
            };

            this.accountsService.createRequisition(requisition).subscribe(
                res => {
                    console.log(res);
                    this.msg.success('Requisition Raised Successfully');
                    this.isRaisingRequisition = false;
                    this.router.navigateByUrl('/flosure/accounts/requisitions');

                    const claimUpdate: Claim = {
                        ...claim,
                        isRequisitionRaised: true
                    };

                    this.claimsService
                        .updateClaim(claimUpdate.id, claimUpdate)
                        .subscribe(res => {
                            console.log(res);
                            this.claimsTableUpdate.next(true);
                        });
                },

                err => {
                    console.log(err);
                    this.msg.error('Failed to raise Requisition');
                    this.isRaisingRequisition = false;
                }
            );
        });
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
                x => x.claimStatus == 'Processed' || 'Approved'
            );
            this.displayProcessedClaimsList = this.processedClaimsList.filter(
                x => x.claimant != null
            );
        });
    }

    checkClaimApproval(claim: Claim) {
        // const riskRegNumbers: string[] = []

        let policyRisksRegNumbers: string[] = claim.policy.risks.map(
            x => x.regNumber
        );

        console.log(
            'r in p:',
            policyRisksRegNumbers.includes(claim.risk.regNumber)
        );

        if (policyRisksRegNumbers.includes(claim.risk.regNumber)) {
            this.isClaimRiskUnderPolicy = true;
        } else {
            this.isClaimRiskUnderPolicy = false;
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

        if (claim.policy.paymentPlan == 'Created') {
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

    searchPendingClaims(value: string) {}

    searchApprovedClaims(value: string) {}
}
