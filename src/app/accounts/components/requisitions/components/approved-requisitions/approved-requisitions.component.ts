import { Component, OnInit } from '@angular/core';
import { IRequisitionModel } from '../../../models/requisition.model';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ClaimsService } from 'src/app/claims/services/claims-service.service';
import { Claim } from 'src/app/claims/models/claim.model';
import * as jwt_decode from 'jwt-decode';
import { UserModel } from '../../../../../users/models/users.model';
import { PermissionsModel } from '../../../../../users/models/roles.model';
import { UsersService } from '../../../../../users/services/users.service';

@Component({
    selector: 'app-approved-requisitions',
    templateUrl: './approved-requisitions.component.html',
    styleUrls: ['./approved-requisitions.component.scss']
})
export class ApprovedRequisitionsComponent implements OnInit {
    columnAlignment = 'center';
    requisitionsIsLoading = false;
    isApprovingRequisition = false;

    requisitionsList: IRequisitionModel[] = [];
    displayRequisitionsList: IRequisitionModel[] = [];

    pendingRequisitionsList: IRequisitionModel[] = [];
    displayPendingRequisitionsList: IRequisitionModel[] = [];

    approvedRequisitionsList: IRequisitionModel[] = [];
    displayApprovedRequisitionsList: IRequisitionModel[] = [];

    requisitionApprovalUpdate = new BehaviorSubject<boolean>(false);

    voucherNumber: string;
    payee: string;

    searchString: string;
    approvedSearchString: string;

    // requisition payment modal
    isRequisitionPaymentModalVisible = false;

  loggedIn = localStorage.getItem('currentUser');
  user: UserModel;
  permission: PermissionsModel;
  isPresentPermission: PermissionsModel;
  process = 'process';
  admin = 'admin';

    constructor(
        private accountsService: AccountService,
        private msg: NzMessageService,
        private claimsService: ClaimsService,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.requisitionsIsLoading = true;
        setTimeout(() => {
            this.requisitionsIsLoading = false;
        }, 3000);

      const decodedJwtData = jwt_decode(this.loggedIn);
      this.usersService.getUsers().subscribe((users) => {
        this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];

        this.isPresentPermission = this.user.Permission.find((el) => el.name === this.process ||
          el.name === this.admin );

      });

        this.accountsService.getRequisitions().subscribe(requisitions => {
            this.requisitionsList = requisitions;
            this.displayRequisitionsList = this.requisitionsList;

            this.pendingRequisitionsList = this.requisitionsList.filter(
                x => x.approvalStatus === 'Pending'
            );
            this.displayPendingRequisitionsList = this.pendingRequisitionsList;

            this.approvedRequisitionsList = this.requisitionsList.filter(
                x =>
                    x.approvalStatus === 'Approved' &&
                    x.paymentStatus === 'UnProcessed'
            );
            this.displayApprovedRequisitionsList = this.approvedRequisitionsList;
        });

        this.requisitionApprovalUpdate.subscribe(update => {
            update === true ? this.updateRequisitionTables() : '';
        });
    }

    approveRequisition(requisition: IRequisitionModel) {
        this.isApprovingRequisition = true;
        const req: IRequisitionModel = {
            ...requisition,
            requisitionNumber: requisition.requisitionNumber.replace(
                'REQ',
                'VOU'
            ),
            approvalStatus: 'Approved',
            authorizationDate: new Date(),
            authorizedBy: localStorage.getItem('user')
        };

        this.accountsService.updateRequisition(requisition.id, req).subscribe(
            res => {
                console.log(res);

                this.requisitionApprovalUpdate.next(true);
                this.msg.success('Requisition Approved');
                this.isApprovingRequisition = false;

                if (requisition.paymentType == 'GIS-CLAIM') {
                    const claimUpdate: Claim = {
                        ...requisition.claim,
                        claimStatus: 'Resolved'
                    };

                    this.claimsService
                        .updateClaim(claimUpdate.id, claimUpdate)
                        .subscribe(res => {
                            console.log(res);
                        });
                }
            },

            err => {
                console.log(err);
                this.msg.error('Requisition Approval failed');
                this.isApprovingRequisition = false;
            }
        );
    }

    processRequisition(requisition: IRequisitionModel) {
        this.accountsService.changeVoucherNumber(requisition.requisitionNumber);
        this.accountsService.changePayee(requisition.payee);
        this.accountsService.changeRequisitionAmount(requisition.amount);
        this.accountsService.changeRequisitionId(requisition.id);
        this.accountsService.changeRequisitionCurrency(requisition.currency);

        this.isRequisitionPaymentModalVisible = true;
    }

    searchPendingRequisitions(value: string): void {
        if (value === '' || !value) {
            this.displayPendingRequisitionsList = this.pendingRequisitionsList;
        }

        this.displayPendingRequisitionsList = this.pendingRequisitionsList.filter(
            requisition => {
                return (
                    requisition.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    requisition.payee
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        );
    }

    searchApprovedRequisitions(value: string): void {
        if (value === '' || !value) {
            this.displayApprovedRequisitionsList = this.approvedRequisitionsList;
        }

        this.displayApprovedRequisitionsList = this.approvedRequisitionsList.filter(
            requisition => {
                return (
                    requisition.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    requisition.payee
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        );
    }

    updateRequisitionTables() {
        this.accountsService.getRequisitions().subscribe(requisitions => {
            this.requisitionsList = requisitions;
            this.displayRequisitionsList = this.requisitionsList;

            this.pendingRequisitionsList = this.requisitionsList.filter(
                x => x.approvalStatus === 'Pending'
            );
            this.displayPendingRequisitionsList = this.pendingRequisitionsList;

            this.approvedRequisitionsList = this.requisitionsList.filter(
                x =>
                    x.approvalStatus === 'Approved' &&
                    x.paymentStatus === 'UnProcessed'
            );
            this.displayApprovedRequisitionsList = this.approvedRequisitionsList;
        });
    }

    trackByRequisitionId(
        index: number,
        requisition: IRequisitionModel
    ): string {
        return requisition.id;
    }
}
