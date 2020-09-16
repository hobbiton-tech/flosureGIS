import { Component, OnInit, } from '@angular/core';
import { CPaymentModel } from '../models/commission-payment.model';
import { CommissionPaymentService } from '../../services/commission-payment.service';
import { IRequisitionModel } from '../models/requisition.model';
import { AccountService } from '../../services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AgentsService } from '../../../settings/components/agents/services/agents.service';
import { Claim } from '../../../claims/models/claim.model';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { UserModel } from '../../../users/models/users.model';
import { PermissionsModel } from '../../../users/models/roles.model';
import { ClaimsService } from '../../../claims/services/claims-service.service';
import { UsersService } from '../../../users/services/users.service';


@Component({
  selector: 'app-commission-payment',
  templateUrl: './commission-payment.component.html',
  styleUrls: ['./commission-payment.component.scss']
})
export class CommissionPaymentComponent implements OnInit {


  typeOfClient = ['Agent', 'Broker', 'Sales Representatives'];
  selectedIntermediary = 'Agent';

  commissionPayment: CPaymentModel;
  commissionPayments: any[] = [];
  comPayments: any[] = [];

  pendingRequisitionsList: IRequisitionModel[] = [];
  displayPendingRequisitionsList: IRequisitionModel[] = [];

  isApprovingRequisition = false;

  requisitionApprovalUpdate = new BehaviorSubject<boolean>(false);

  loggedIn = localStorage.getItem('currentUser');
  user: UserModel;
  permission: PermissionsModel;
  isPresentPermission: PermissionsModel;
  approve = 'approve_requisition';
  raise = 'raise_requisition';
  admin = 'admin';




  constructor( private commissionPaymentService: CommissionPaymentService,
               private accountsService: AccountService,
               private msg: NzMessageService,
               private agentsService: AgentsService,
               private usersService: UsersService
             ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {

    const decodedJwtData = jwt_decode(this.loggedIn);

    this.usersService.getUsers().subscribe((users) => {
      this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];

      this.isPresentPermission = this.user.Permission.find((el) => el.name === this.approve ||
        el.name === this.admin ||  el.name === this.raise);

    });
    this.commissionPaymentService.getCPayment().subscribe((res) => {
      this.comPayments = res.data.filter((x) => x.status !== 'Paid' && x.agent_type === this.selectedIntermediary);
      this.commissionPayments = this.comPayments;
    });

    this.accountsService.getRequisitions().subscribe(requisitions => {

      this.pendingRequisitionsList = requisitions.filter(
        x => x.approvalStatus === 'Pending' && x.paymentType === 'GIS-COM'
      );
      this.displayPendingRequisitionsList = this.pendingRequisitionsList;
    });
  }


  onBack(): void {
    console.log('onBack');
  }

  selectInt(value) {
    this.selectedIntermediary = value;
    console.log('Intermediary>>>', this.selectedIntermediary);

    this.refresh();
  }


  raiseReq(value) {

    const req: IRequisitionModel = {
      amount: value.commission_amount,
      approvalStatus: 'Pending',
      cancellationDate: new Date(),
      currency: 'ZMW',
      dateCreated: new Date(),
      payee: value.agent_name,
      paymentType: 'GIS-COM',
      policyNumber: '',
      requisitionNumber: '',
      id: ''
    };

    this.accountsService.generateReqNumber().subscribe((reqNum: any) => {
      req.requisitionNumber = reqNum.data.requisition_number;
      this.accountsService.createRequisition(req).subscribe((req) => {
          value.status = 'Requisition Raised';
          this.commissionPaymentService.updateCPayment(value).subscribe((comm) => {
            this.refresh();
          }, (comErr) => {
            this.msg.error(comErr);
          });
          this.msg.success('Requisition Successfully Raised');

        },
        (error) => {
          this.msg.error(error);
        });
    });
  }

  cancelReq() {}

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
        this.refresh();
      },

      err => {
        console.log(err);
        this.msg.error('Requisition Approval failed');
        this.isApprovingRequisition = false;
      }
    );
  }

//   showModal(): void {
//     this.isVisible = true;
// }

}
