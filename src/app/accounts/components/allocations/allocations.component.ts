import { Component, OnInit } from '@angular/core';
import { AllocationsService } from '../../services/allocations.service';
import { AccountService } from '../../services/account.service';
import { AllocationPolicy, AllocationReceipt } from '../models/allocations.model';
import { NzMessageService } from 'ng-zorro-antd';
import { AgentsService } from '../../../settings/components/agents/services/agents.service';
import { IAgent, IBroker, ISalesRepresentative } from '../../../settings/components/agents/models/agents.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommissionPaymentService } from '../../services/commission-payment.service';
import { CPaymentModel } from '../models/commission-payment.model';
import { PoliciesService } from '../../../underwriting/services/policies.service';
import { Policy } from '../../../underwriting/models/policy.model';

@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.component.html',
  styleUrls: ['./allocations.component.scss']
})
export class AllocationsComponent implements OnInit {

  typeOfIntermediaries = ['Broker', 'Agent', 'Sales Representatives'];

  selectedIntermediaryType = 'Broker';

  allocationReceipt: AllocationReceipt;
  allocationReceiptsList: any[] = [];
  inAllocationReceiptsList: any[] = [];

  commissionAmount = 0;


  allocationPolicy: AllocationPolicy;

  commissionPayment: CPaymentModel;
  commissionPayments: any[] = [];
  inCommissionPayments: any[] = [];

  allocationPoliciesList: any[] = [];
  inAllocationPoliciesList: any[] = [];
  amount: number;
  selectedRole: any;
   brokers: IBroker[] = [];
   agents: IAgent[] = [];
   salesReps: ISalesRepresentative[] = [];
   selectedInt = '';
   policyTableActive = true;
  isAllocateVisible = false;
  allocationForm: FormGroup;
  checked = false;
  policies: Policy[] = [];
  policy: Policy;

  constructor(private allocationsService: AllocationsService,
              private message: NzMessageService,
              private agentsService: AgentsService,
              private formBuilder: FormBuilder,
              private commissionPaymentService: CommissionPaymentService,
              private policeServices: PoliciesService,
              ) {
    this.allocationForm = this.formBuilder.group({
      policy: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  this.refresh();
  }

  refresh() {

    this.agentsService.getBrokers().subscribe((brokers) => {
      this.brokers = brokers;
    });

    this.agentsService.getAgents().subscribe((agents) => {
      this.agents = agents;
    });

    this.agentsService.getSalesRepresentatives().subscribe((salesReps) => {
      this.salesReps = salesReps;
    });
    this.allocationsService.getAllocationReceipt().subscribe((res) => {
      this.inAllocationReceiptsList = res.data.filter((x) => x.intermediary_type === this.selectedIntermediaryType);
      this.allocationReceiptsList = this.inAllocationReceiptsList;
    });


    this.policeServices.getPolicies().subscribe((policies) => {
      this.policies = policies.filter((x) => x.paymentPlan === 'NotCreated' && x.receiptStatus === 'Unreceipted');
    });
    this.commissionPaymentService.getCPayment().subscribe((commissionPayments) => {
      this.inCommissionPayments = commissionPayments.data;
      this.commissionPayments = this.inCommissionPayments;
    });



    this.allocationsService.getAllocationPolicy().subscribe((res) => {
      this.inAllocationPoliciesList = res.data;
      this.allocationPoliciesList = this.inAllocationPoliciesList;
    });
  }

  selectIntermediaryType(value) {
    this.selectedIntermediaryType = value;

    this.refresh();
  }

  showAllocationRole(receipt) {
    if (this.selectedInt === '') {
      this.message.warning('Select Intermediary!');
    } else {
      this.policyTableActive = false;
      if ( receipt.allocation_status !== 'Allocated') {
        this.amount = receipt.amount;
        this.selectedRole = receipt;
        this.allocationReceipt = receipt;
        // this.allocationPoliciesList = this.allocationReceiptsList.filter((x) => x.intermediary_id ===  receipt.intermediary_id);
      } else {
        this.message.warning('Receipt Already Allocated!');
      }
    }
  }

  showAllocationModal(value) {
    this.isAllocateVisible = true;
    this.allocationPolicy = value;
    this.allocationForm
      .get('policy')
      .setValue(value.policy_number);
    this.allocationForm
      .get('amount')
      .setValue(value.balance);
  }

  selectInt(value) {
    this.selectedInt = value;
    console.log('Check Agent>>>', this.selectedInt);
    this.allocationReceiptsList = this.inAllocationReceiptsList.filter((x) => x.intermediary_id === this.selectedInt);

    this.allocationPoliciesList = this.inAllocationPoliciesList.filter((x) => x.intermediary_id === this.selectedInt );
  }

  handleAllocateCancel() {
    this.isAllocateVisible = false;
  }

  handleAllocationOk() {
    this.isAllocateVisible = false;

    this.policy = this.policies.filter((x) => x.policyNumber === this.allocationForm.controls.policy.value)[0];



    if (this.checked) {
      this.allocationReceipt.remaining_amount = this.allocationReceipt.remaining_amount - this.allocationPolicy.gross_amount;
    } else {
      this.allocationReceipt.remaining_amount = this.allocationReceipt.remaining_amount - this.allocationForm.controls.amount.value;
    }


    this.allocationReceipt.allocated_amount = this.allocationReceipt.allocated_amount + this.allocationForm.controls.amount.value;
    this.allocationPolicy.balance = this.allocationPolicy.balance - this.allocationForm.controls.amount.value;
    this.allocationPolicy.settlements = this.allocationPolicy.settlements + this.allocationForm.controls.amount.value;

    if (this.allocationReceipt.remaining_amount === 0) {
      this.allocationReceipt.status = 'Allocated';
    } else if (this.allocationReceipt.remaining_amount > 0 && this.allocationReceipt.remaining_amount < this.allocationReceipt.amount) {
      this.allocationReceipt.status = 'Partially Allocated';
    }



    if (this.allocationPolicy.balance === 0.00) {
      this.allocationPolicy.status = 'Allocated';
      console.log('Check Policy>>>>', this.policy);
      this.policy.receiptStatus = 'Receipted';
      this.policy.paymentPlan = 'Created';
    } else if (this.allocationPolicy.balance > 0 && this.allocationPolicy.balance < this.allocationPolicy.net_amount_due) {
      this.allocationPolicy.status = '';
    }

    if (this.checked) {
      if (this.commissionPayments === undefined || this.commissionPayments.length === 0) {
        this.commissionPayment = {
          agent_id: this.allocationPolicy.intermediary_id,
          agent_name: this.allocationPolicy.intermediary_name,
          commission_amount: this.allocationPolicy.commission_due,
          paid_amount: 0,
          remaining_amount: 0,
          status: 'Not Paid',
          agent_type: this.selectedIntermediaryType
        };

        this.commissionPaymentService.createCPayment(this.commissionPayment).subscribe((comm) => {}, (commErr) => {
          this.message.error(commErr);
        });
      } else {
        for (const c of this.commissionPayments) {

          if (c.agent_id !== this.allocationPolicy.intermediary_id) {
            this.commissionPayment = {
              agent_id: this.allocationPolicy.intermediary_id,
              agent_name: this.allocationPolicy.intermediary_name,
              commission_amount: this.allocationPolicy.commission_due,
              paid_amount: 0,
              remaining_amount: 0,
              status: 'Not Paid',
              agent_type: this.selectedIntermediaryType
            };




            this.commissionPaymentService.createCPayment(this.commissionPayment).subscribe((comm) => {}, (commErr) => {
              this.message.error(commErr);
            });
            break;
          }

          if (c.agent_id ===  this.allocationPolicy.intermediary_id && c.status === 'Not Paid') {
            // this.commissionAmount = this.commissionAmount + c.commission_amount;
            c.commission_amount = Number(c.commission_amount + this.allocationPolicy.commission_due);

            console.log('checking C>>>', c);

            this.commissionPaymentService.updateCPayment(c).subscribe((commP) => {}, (comPErr) => {
              this.message.error(comPErr);
            });

            break;
          }
        }
      }
    }




    this.allocationsService.updateAllocationReceipt(this.allocationReceipt).subscribe((receipt) => {
      this.allocationsService.updateAllocationPolicy(this.allocationPolicy).subscribe((policy) => {
        this.message.success('Allocated Successfully');
        this.policeServices.updatePolicy(this.policy).subscribe((iPolicy) => {}, (policyErr) => {
          this.message.error(policyErr);
        });
      }, (error) => {
        this.message.error(error);
      });
    }, (err) => {
      this.message.error(err);
    });
  }


log(value) {
  console.log('What is There>>>', value);
  this.checked = value;
}

}
