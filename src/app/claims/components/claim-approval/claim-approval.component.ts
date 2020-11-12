import { Component, OnInit } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { IRequisitionModel } from 'src/app/accounts/components/models/requisition.model';
import { v4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { PermissionsModel } from '../../../users/models/roles.model';
import { UserModel } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';

@Component({
    selector: 'app-claim-approval',
    templateUrl: './claim-approval.component.html',
    styleUrls: ['./claim-approval.component.scss']
})
export class ClaimApprovalComponent implements OnInit {
    columnAlignment = 'center';
    claimApprovalIsLoading = false;
    isRaisingRequisition: boolean = false;

    claimsList: Claim[];

    approvedClaimsList: Claim[];
    displayApprovedClaimsList: Claim[];

  approvedThirdPartyClaimsList: Claim[];
  displayApprovedThirdPartyClaimsList: Claim[];

    searchPendingClaimsString: string;
    searchApprovedClaimsString: string;
  searchThirdPartyApprovedClaimsString: string;

  paramId: any;

    claimsTableUpdate = new BehaviorSubject<boolean>(false);

    permission: PermissionsModel;
    user: UserModel;
    isPresent: PermissionsModel;
    admin = 'admin';
    raiseRequisitionPem = 'raise_requisition';
    loggedIn = localStorage.getItem('currentUser');

    constructor(
        private readonly claimsService: ClaimsService,
        private claimProcessingService: ClaimsProcessingServiceService,
        private accountsService: AccountService,
        private msg: NzMessageService,
        private readonly router: Router,
        private http: HttpClient,
        private usersService: UsersService,
        private activateRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.claimApprovalIsLoading = true;
        this.activateRoute.params.subscribe(param => {

        this.paramId = param.id;
        // setTimeout(() => {
        //     this.claimApprovalIsLoading = false;
        // }, 3000);

        const decodedJwtData = jwt_decode(this.loggedIn);
        console.log('Decoded>>>>>>', decodedJwtData);

        this.usersService.getUsers().subscribe(users => {
          this.user = users.filter(x => x.ID === decodedJwtData.user_id)[0];

          this.isPresent = this.user.Permission.find(
            el =>
              el.name === this.admin ||
              el.name === this.raiseRequisitionPem
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
        this.claimsList = claims;

        this.approvedClaimsList = this.claimsList.filter(
          x => x.claimStatus === 'Approved' && x.claimType === 'Own Damage' && x.claimNumber === this.paramId
        );
        this.displayApprovedClaimsList = this.approvedClaimsList.filter(
          x => x.claimNumber != null && x.isRequisitionRaised === false
        );


        this.approvedThirdPartyClaimsList = this.claimsList.filter(
          x => x.claimStatus === 'Approved' && x.claimType === 'Third Party' && x.claimNumber === this.paramId
        );

        this.displayApprovedThirdPartyClaimsList = this.approvedClaimsList.filter(
          x => x.claimNumber != null && x.isRequisitionRaised === false
        );

        this.claimApprovalIsLoading = false;
      });

    }

    viewClaimDetails(claim: Claim): void {
        this.claimProcessingService.changeClaim(claim);

        this.router.navigateByUrl('/flosure/claims/claim-details/' + claim.id);
    }

    updateClaimsTables() {
        this.claimsService.getClaims().subscribe(claims => {
            this.claimsList = claims;

            this.approvedClaimsList = this.claimsList.filter(
                x => x.claimStatus === 'Approved'
            );
            this.displayApprovedClaimsList = this.approvedClaimsList.filter(
                x => x.claimNumber != null && x.isRequisitionRaised === false
            );
        });
    }

    searchApprovedClaims(value: string) {
        if (value === '' || !value) {
            this.displayApprovedClaimsList = this.approvedClaimsList.filter(
                x => x.claimNumber != null && x.isRequisitionRaised === false
            );
        }

        this.displayApprovedClaimsList = this.approvedClaimsList.filter(
            claim => {
                if (
                    claim.claimNumber != null &&
                    claim.isRequisitionRaised === false
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
                        claim.claimant.firstName
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    );
                }
            }
        );
    }

  searchApprovedThirdPartyClaims(value: string) {
    if (value === '' || !value) {
      this.displayApprovedClaimsList = this.approvedClaimsList.filter(
        x => x.claimNumber != null && x.isRequisitionRaised === false
      );
    }

    this.displayApprovedClaimsList = this.approvedClaimsList.filter(
      claim => {
        if (
          claim.claimNumber != null &&
          claim.isRequisitionRaised === false
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
            claim.claimant.firstName
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
      }
    );
  }

    raiseRequisition(claim: Claim) {
        this.isRaisingRequisition = true;
        console.log(claim);
        this.accountsService.getRequisitions().subscribe(requisitions => {
            this.http
                .get<any>(
                    `https://number-generation.flosure-api.com/aplus-requisition-number`
                )
                .subscribe(async res => {
                    console.log('res:', res);
                    const requisitionNumber = res.data.requisition_number;

                    const requisition: IRequisitionModel = {
                        id: v4(),
                        policyNumber: claim.policy.policyNumber,
                        requisitionNumber: requisitionNumber,
                        payee:
                            claim.claimant.firstName +
                            ' ' +
                            claim.claimant.lastName,
                        cancellationDate: claim.notificationDate,
                        dateCreated: new Date(),
                        approvalStatus: 'Pending',
                        paymentType: 'GIS-CLAIM',
                        currency: claim.policy.currency,
                        amount: claim.lossQuantum.adjustedQuantum,
                        paymentStatus: 'UnProcessed',
                        claim: claim
                    };

                    this.accountsService
                        .createRequisition(requisition)
                        .subscribe(
                            res => {
                                console.log(res);
                                this.msg.success(
                                    'Requisition Raised Successfully'
                                );
                                this.isRaisingRequisition = false;
                                // this.router.navigateByUrl(
                                //     '/flosure/accounts/requisitions'
                                // );

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
                                this.refresh();
                            },

                            err => {
                                console.log(err);
                                this.msg.error('Failed to raise Requisition');
                                this.isRaisingRequisition = false;
                            }
                        );
                });
        });
    }
}
