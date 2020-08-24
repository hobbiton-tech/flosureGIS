import { Component, OnInit, } from '@angular/core';
import { CPaymentModel } from '../models/commission-payment.model';
import { CommissionPaymentService } from '../../services/commission-payment.service';
import { IRequisitionModel } from '../models/requisition.model';
import { AccountService } from '../../services/account.service';
import { NzMessageService } from 'ng-zorro-antd';


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




  constructor( private commissionPaymentService: CommissionPaymentService,
               private accountsService: AccountService,
               private msg: NzMessageService,
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
      amount: 0,
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

    this.accountsService.createRequisition(req, '').subscribe((req) => {
        value.status = "Requisition Raised"
        this.commissionPaymentService.updateCPayment(value).subscribe((comm) => {}, (comErr) => {
          this.msg.error(comErr)
        })
      this.msg.success('Requisition Successfully Raised')
      },
      (error) => {
        this.msg.error(error)
      })



  }

  cancelReq() {}

//   showModal(): void {
//     this.isVisible = true;
// }

}
