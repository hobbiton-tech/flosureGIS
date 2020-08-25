import { Component, OnInit, } from '@angular/core';
import { CPaymentModel } from '../models/commission-payment.model';
import { CommissionPaymentService } from '../../services/commission-payment.service';
import { IRequisitionModel } from '../models/requisition.model';
import { AccountService } from '../../services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AgentsService } from '../../../settings/components/agents/services/agents.service';
import { Claim } from '../../../claims/models/claim.model';
import { BehaviorSubject } from 'rxjs';


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

  pendingRequisitionsList: IRequisitionModel[] = [];
  displayPendingRequisitionsList: IRequisitionModel[] = [];

  isApprovingRequisition = false;

  requisitionApprovalUpdate = new BehaviorSubject<boolean>(false);




  constructor( private commissionPaymentService: CommissionPaymentService,
               private accountsService: AccountService,
               private msg: NzMessageService,
               private agentsService: AgentsService,
             ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.commissionPaymentService.getCPayment().subscribe((res) => {
      this.commissionPayments = res.data.filter((x) => x.status !== 'Paid');
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

    this.commissionPayments = this.commissionPayments.filter((x) => x.agent_type = this.selectedIntermediary);
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
    }

    this.accountsService.generateReqNumber().subscribe((reqNum: any) => {
      req.requisitionNumber = reqNum.data.requisition_number;
      this.accountsService.createRequisition(req).subscribe((req) => {
          value.status = "Requisition Raised"
          this.commissionPaymentService.updateCPayment(value).subscribe((comm) => {
            this.refresh();
          }, (comErr) => {
            this.msg.error(comErr)
          })
          this.msg.success('Requisition Successfully Raised')

        },
        (error) => {
          this.msg.error(error)
        })
    })
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
