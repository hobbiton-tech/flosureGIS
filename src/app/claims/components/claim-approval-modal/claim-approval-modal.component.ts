import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Claim } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-claim-approval-modal',
    templateUrl: './claim-approval-modal.component.html',
    styleUrls: ['./claim-approval-modal.component.scss']
})
export class ClaimApprovalModalComponent implements OnInit, OnDestroy {
    isApprovingClaim: boolean = false;
    isCancellingClaim: boolean = false;
    claimSubscription: Subscription;

    // isClaimRiskUnderPolicy: boolean = false;
    // isClaimLossDateUnderPolicyPeriod: boolean = false;
    // isClaimPolicyPremiumFullyPaid: boolean = false;
    // isClaimFullyDocumented: boolean = false;

    @Input()
    isClaimApprovalModalVisible: boolean;

    @Input()
    claim: Claim;

    @Input()
    isClaimRiskUnderPolicy: boolean;

    @Input()
    isClaimLossDateUnderPolicyPeriod: boolean;

    @Input()
    isClaimPolicyPremiumFullyPaid: boolean;

    @Input()
    isClaimFullyDocumented: boolean;

    @Output()
    closeClaimApprovalModalEmitter: EventEmitter<any> = new EventEmitter();

    title = 'Claim Approval';

    currentClaim: Claim;

    constructor(
        private msg: NzMessageService,
        private claimsService: ClaimsService,
        private claimProcessingService: ClaimsProcessingServiceService
    ) {
        this.claimSubscription = this.claimProcessingService.claimChanged$.subscribe(
            claim => {
                this.currentClaim = claim;
            }
        );
    }

    ngOnInit(): void {
        this.checkClaimApproval();
    }

    closeClaimApprovalModal() {
        this.closeClaimApprovalModalEmitter.emit(true);
    }

    checkClaimApproval() {
        if (this.currentClaim) {
            if (
                this.currentClaim.policy.risks.includes(this.currentClaim.risk)
            ) {
                console.log('1: Yes');
                this.isClaimRiskUnderPolicy = true;
            } else {
                console.log('1: No');
                this.isClaimRiskUnderPolicy = false;
            }

            if (
                moment(this.currentClaim.lossDate).isBetween(
                    this.currentClaim.risk.riskStartDate,
                    this.currentClaim.risk.riskEndDate,
                    'days',
                    '[]'
                )
            ) {
                this.isClaimLossDateUnderPolicyPeriod = true;
            } else {
                this.isClaimLossDateUnderPolicyPeriod = false;
            }

            if (this.currentClaim.policy.paymentPlan != 'Created') {
                this.isClaimPolicyPremiumFullyPaid = true;
            } else {
                this.isClaimPolicyPremiumFullyPaid = false;
            }

            if (
                this.currentClaim.documentUploads.filter(
                    x => x.documentType == 'Drivers License'
                ).length > 0 &&
                this.currentClaim.documentUploads.filter(
                    x => x.documentType == 'Claim Form'
                ).length > 0
            ) {
                this.isClaimFullyDocumented = true;
            } else {
                this.isClaimFullyDocumented = false;
            }
        }
    }

    approveClaim() {
        this.isApprovingClaim = true;
        const claimUpdate: Claim = {
            ...this.currentClaim,
            claimStatus: 'Approved'
        };

        this.claimsService
            .updateClaim(this.currentClaim.id, claimUpdate)
            .subscribe(
                res => {
                    console.log(res);
                    this.isApprovingClaim = false;
                    this.closeClaimApprovalModal();
                    this.isClaimApprovalModalVisible = false;
                    this.msg.success('Claim Approved!');
                },
                err => {
                    console.log(err);
                    this.isApprovingClaim = false;
                    this.isClaimApprovalModalVisible = false;
                    this.msg.error('Failed to approve claim');
                }
            );
    }

    cancelClaim() {
        this.isCancellingClaim = true;
        const claimUpdate: Claim = {
            ...this.currentClaim,
            claimStatus: 'Cancelled'
        };

        this.claimsService
            .updateClaim(this.currentClaim.id, claimUpdate)
            .subscribe(
                res => {
                    console.log(res);
                    this.isCancellingClaim = false;
                    this.isClaimApprovalModalVisible = false;
                    this.msg.success('Claim Cancelled!');
                },
                err => {
                    console.log(err);
                    this.isCancellingClaim = false;
                    this.isClaimApprovalModalVisible = false;
                    this.msg.error('Failed to cancel claim');
                }
            );
    }

    ngOnDestroy() {
        this.claimSubscription.unsubscribe();
    }
}
