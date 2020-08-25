import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { ISalesRepresentative } from 'src/app/settings/components/agents/models/agents.model';
import { IReceiptModel } from '../../../models/receipts.model';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import _ from 'lodash';
import { v4 } from 'uuid';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { IDebitNoteDTO } from 'src/app/quotes/models/debit-note.dto';
import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';
import { AllocationPolicy, AllocationReceipt } from '../../../models/allocations.model';
import { AllocationsService } from '../../../../services/allocations.service';
import { HttpClient } from '@angular/common/http';
import { CommissionPaymentService } from '../../../../services/commission-payment.service';
import { CPaymentModel } from '../../../models/commission-payment.model';

@Component({
    selector: 'app-sales-representative-client',
    templateUrl: './sales-representative-client.component.html',
    styleUrls: ['./sales-representative-client.component.scss'],
})
export class SalesRepresentativeClientComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    receiptsCount = 0;

    unreceiptedList: Policy[];

    salesRepList: ISalesRepresentative[];

    receiptedList: IReceiptModel[];
    displayReceiptedList: IReceiptModel[];

    cancelledReceiptList: IReceiptModel[];
    displayCancelledReceiptList: IReceiptModel[];

    receiptObj: IReceiptModel = new IReceiptModel();
    receipt: IReceiptModel;
    today = new Date();
    clientName = '';
    policy: Policy = new Policy();
    cancelReceipt: IReceiptModel = new IReceiptModel();
    reinstateReceipt: IReceiptModel = new IReceiptModel();
    size = 'large';

    recStatus = 'Receipted';

    receiptNum = '';

    policyAmount = 0;

    receiptList = [];
    cancelReceiptList = [];

    isVisible = false;
    isCancelVisible = false;
    isReinstateVisible = false;
    isOkLoading = false;
    policyNumber = '';
    user = '';
    _id = '';
    isVisibleClientType = false;
    isOkClientTypeLoading = false;
    agent: any;
    isConfirmLoading = false;
    receiptNewCount: number;
    paymentMethod = '';

  allocationPolicy: AllocationPolicy;
  allocationReceipt: AllocationReceipt

  allocationPolicies: any[] = [];
  allocationsReceipts: any[] = [];

    optionList = [
        { label: 'Premium Payment', value: 'Premium Payment' },
        { label: 'Third Party Recovery', value: 'Third Party Recovery' },
        {
            label: 'Imprest Retirement Receipt',
            value: 'Imprest Retirement Receipt',
        },
        { label: 'Third Party Recovery', value: 'Third Party Recovery' },
        { label: 'General Receipt', value: 'General Receipt' },
    ];

    paymentMethodList = [
        { label: 'Cash', value: 'cash' },
        { label: 'EFT', value: 'eft' },
        { label: 'Bank Transfer', value: 'bank transfer' },
        { label: 'Cheque', value: 'cheque' },
    ];

    typeOfClient = ['Direct', 'Agent', 'Broker'];

    selectedType = 'Direct';
    selectedSale: any;
    listofUnreceiptedReceipts: Policy[];
    displayedListOfUnreceiptedReceipts: Policy[] = [];
    sourceOfBusiness: string;
    intermediaryName: string;
    debitnoteList: DebitNote[] = [];
    debitnote: DebitNote;
    currency: string;
    searchString: string;
  commissionPayments: any[] = [];
  commissionPayment: CPaymentModel;

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private policeServices: PoliciesService,
        private router: Router,
        private agentService: AgentsService,
        private allocationsService: AllocationsService,
        private http: HttpClient,
        private commissionPaymentService: CommissionPaymentService,
    ) {
        this.receiptForm = this.formBuilder.group({
            received_from: ['', Validators.required],
            // sumInDigits: [this.policyAmount],
            payment_method: ['', Validators.required],
            receipt_type: ['', Validators.required],
            narration: ['', Validators.required],
            date_received: [''],
            today_date: [''],
            remarks: [''],
            cheq_number: [''],
        });

        this.cancelForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
        this.reinstateForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
      this.agentService.getSalesRepresentatives().subscribe((salesRep) => {
        this.salesRepList = salesRep;

        console.log('===================');
        console.log(this.salesRepList);
      });
      this.policeServices.getPolicies().subscribe((quotes) => {
        this.listofUnreceiptedReceipts = _.filter(
          quotes,
          (x) =>
            x.receiptStatus === 'Unreceipted' &&
            x.sourceOfBusiness === 'SalesRepresentative'
        );

        this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts;

        this.receiptsCount = _.filter(
          quotes,
          (x) =>
            x.receiptStatus === 'Unreceipted' &&
            x.sourceOfBusiness === 'SalesRepresentative' && x.paymentPlan === 'NotCreated'
        ).length;
        console.log('======= Unreceipt List =======');
        console.log(this.listofUnreceiptedReceipts);
      });

      this.policeServices.getDebitNotes().subscribe((invoice) => {
        this.debitnoteList = invoice;
      });

      this.allocationsService.getAllocationPolicy().subscribe((allocationPolicies) => {
        this.allocationPolicies = allocationPolicies.data;
      });

      this.allocationsService.getAllocationReceipt().subscribe((allocationsReceipts) =>{
        this.allocationsReceipts = allocationsReceipts.data;
      });

      this.commissionPaymentService.getCPayment().subscribe((commissionPayments) => {
        this.commissionPayments = commissionPayments.data;
      });

      this.receiptService.getReciepts().subscribe((receipts) => {
        this.receiptedList = _.filter(
          receipts.data,
          (x) =>
            x.receipt_status === 'Receipted' &&
            x.source_of_business === 'SalesRepresentative'
        );
        this.displayReceiptedList = this.receiptedList;


        console.log('======= Receipt List =======');
        console.log(this.receiptedList);

        this.cancelReceiptList = _.filter(
          receipts.data,
          (x) =>
            x.receipt_status === 'Cancelled' &&
            x.source_of_business === 'SalesRepresentative'
        );
        this.displayCancelledReceiptList = this.cancelReceiptList;

        console.log('======= Cancelled Receipt List =======');
        console.log(this.cancelReceiptList);
        this.receiptNewCount = receipts.length;
      });
    }


    log(value): void {
        console.log('Receipts', this.listofUnreceiptedReceipts);

        this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts.filter(
            (x) => x.intermediaryName === value
        );
        console.log(this.listofUnreceiptedReceipts);
        console.log(
            'SELECTED',
            value,
            this.displayedListOfUnreceiptedReceipts,
            this.selectedSale
        );
    }

    showModal(unreceipted: Policy): void {
        this.isVisible = true;
        this.clientName = unreceipted.client;
        this.policyNumber = unreceipted.policyNumber;
        this.user = unreceipted.user;
        this.policy = unreceipted;
        this.debitnote = this.debitnoteList.filter(
            (x) => x.policy.id === unreceipted.id
        )[0];
        this.policyAmount = unreceipted.netPremium;
        this.currency = unreceipted.currency;
        this.sourceOfBusiness = unreceipted.sourceOfBusiness;
        this.intermediaryName = unreceipted.intermediaryName;
      this.allocationPolicy = this.allocationPolicies.filter((x) => x.policy_number === unreceipted.policyNumber)[0];
        console.log(this.policyAmount);
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    async handleOk() {
        this.submitted = true;
        console.log('DEBIT NOTE NUMBER>>>>>', this.debitnote.debitNoteNumber);
        if (this.receiptForm.valid) {
            this.isOkLoading = true;
            this._id = v4();
            const receipt: IReceiptModel = {
                received_from: this.receiptForm.controls.received_from.value,
                payment_method: this.receiptForm.controls.payment_method.value,
                receipt_type: this.receiptForm.controls.receipt_type.value,
                narration: this.receiptForm.controls.narration.value,
                date_received: new Date(),
                remarks: this.receiptForm.controls.remarks.value,
                cheq_number: this.receiptForm.controls.cheq_number.value,
                on_behalf_of: this.clientName,
                captured_by: this.user,
                receipt_status: this.recStatus,
                sum_in_digits: Number(this.policyAmount),
                today_date: new Date(),
                invoice_number: this.debitnote.debitNoteNumber,
                source_of_business: this.sourceOfBusiness,
                intermediary_name: this.intermediaryName,
                currency: this.currency,
            };


          this.allocationPolicy.balance = 0;
          this.allocationPolicy.settlements = Number(this.policy.netPremium);
          this.allocationPolicy.status = 'Allocated'




          this.allocationReceipt = {
            allocated_amount: Number(this.policy.netPremium),
            amount: Number(this.policy.netPremium),
            intermediary_id: this.policy.intermediaryId,
            intermediary_name: this.policy.intermediaryName,
            intermediary_type: 'Agent',
            receipt_number: '',
            remaining_amount: 0,
            status: 'Allocated'
          }

            this.policy.receiptStatus = 'Receipted';
            this.policy.paymentPlan = 'Created';
            this.receiptNum = this._id;




          if (this.commissionPayments === undefined || this.commissionPayments.length == 0) {
            this.commissionPayment = {
              agent_id: this.policy.intermediaryId,
              agent_name: this.policy.intermediaryName,
              commission_amount: this.allocationPolicy.commission_due,
              paid_amount: 0,
              remaining_amount: 0,
              status: 'Not Paid',
              agent_type: 'Agent'
            }

            this.commissionPaymentService.createCPayment(this.commissionPayment).subscribe((comm) => {}, (commErr) => {
              this.message.error(commErr)
            })
          } else {
            for (const c of this.commissionPayments) {

              if (c.agent_id !== this.allocationPolicy.intermediary_id) {
                this.commissionPayment = {
                  agent_id: this.policy.intermediaryId,
                  agent_name: this.policy.intermediaryName,
                  commission_amount: this.allocationPolicy.commission_due,
                  paid_amount: 0,
                  remaining_amount: 0,
                  status: 'Not Paid',
                  agent_type: 'Agent'
                }




                this.commissionPaymentService.createCPayment(this.commissionPayment).subscribe((comm) => {}, (commErr) => {
                  this.message.error(commErr)
                })
                break
              }

              if (c.agent_id ===  this.policy.intermediaryId && c.status === 'Not Paid') {
                // this.commissionAmount = this.commissionAmount + c.commission_amount;
                c.commission_amount = Number(c.commission_amount + this.allocationPolicy.commission_due);

                console.log("checking C>>>", c);

                this.commissionPaymentService.updateCPayment(c).subscribe((commP) => {}, (comPErr) => {
                  this.message.error(comPErr)
                });

                break
              }
            }
          }




          this.http.get<any>(
            `https://number-generation.flosure-api.com/savenda-receipt-number/1`
          )
            .subscribe(async (res) => {
              receipt.receipt_number = res.data.receipt_number;
              console.log(res.data.receipt_number);

              this.http.post('https://payment-api.savenda-flosure.com/receipt', receipt).subscribe((resN: any) => {
                  this.message.success('Receipt Successfully created');
                  console.log('RECEIPT NUMBER<><><><>', resN);

                  this.allocationReceipt.receipt_number = resN.data.receipt_number;

                  this.allocationsService.createAllocationReceipt(this.allocationReceipt).subscribe((resMess) => {
                    console.log('Allocation Receipt Res>>>', resMess);
                  }, (errMess) => {
                    this.message.warning('Allocate Receipt Failed');
                  });
                  this.allocationsService.updateAllocationPolicy(this.allocationPolicy).subscribe((policyRes) => {
                    console.log('Allocation Policy Res>>>', policyRes);
                  }, (policyErr) => {
                    this.message.error(policyErr);
                  })

                  this.policeServices.updatePolicy(this.policy).subscribe((res) => {}, (err) => {
                    console.log('Update Policy Error', err);
                  });

                  this.generateID(resN.data.ID);

                },
                err => {
                  this.message.warning('Receipt Failed');
                  console.log(err);
                });



            });





          // await this.receiptService
            //     .addReceipt(receipt, this.policy.risks[0].insuranceType).subscribe((mess) => {
            //         this.message.success('Receipt Successfully created');
            //         console.log(mess);
            //         this.policeServices.updatePolicy(this.policy).subscribe((res) => {}, (err) => {
            //         console.log('Update Policy Error', err); });
            //     },
            //     (err) => {
            //         this.message.warning('Receipt Failed');
            //         console.log(err);
            //     });

            this.receiptForm.reset();
            setTimeout(() => {
                this.isVisible = false;
                this.isOkLoading = false;
            }, 30);

            // this.generateID(this._id);
        }
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    showCancelModal(receipt: IReceiptModel) {
        this.isCancelVisible = true;
        this.cancelReceipt = receipt;
    }

    cancelCancellation() {
        this.isCancelVisible = false;
    }

    async onCancel() {
        this.cancelReceipt.receipt_status = 'Cancelled';
        this.cancelReceipt.remarks = this.cancelForm.controls.remarks.value;
        console.log('<++++++++++++++++++CLAIN+++++++++>');
        console.log(this.cancelReceipt);
        await this.receiptService.updateReceipt(this.cancelReceipt).subscribe((res) => {
          this.message.success('Receipt Successfully Updated');
          this.refresh();
        }, (err) => {
          console.log('Check ERR>>>>', err);
          this.message.warning('Receipt Failed');
        });
        this.isCancelVisible = false;
    }

    showReinstateModal(receipt: IReceiptModel) {
        this.isReinstateVisible = true;
        this.reinstateReceipt = receipt;
    }

    cancelReinstate() {
        this.isReinstateVisible = false;
    }

    async onReinstate() {
        this.reinstateReceipt.receipt_status = 'Receipted';
        this.reinstateReceipt.remarks = this.cancelForm.controls.remarks.value;
        console.log('<++++++++++++++++++CLAIN+++++++++>');
        console.log(this.reinstateReceipt);
        await this.receiptService.updateReceipt(this.reinstateReceipt).subscribe((res) => {
          this.message.success('Receipt Successfully Updated');
          this.refresh();
        }, (err) => {
          console.log('Check ERR>>>>', err);
          this.message.warning('Receipt Failed');
        });
        this.isReinstateVisible = false;
    }

    // pop Confirm
    cancel() {}

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }

    showClientTypeModal(): void {
        this.isVisibleClientType = true;
    }

    handleOkClientType(): void {
        this.isOkClientTypeLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isOkClientTypeLoading = false;
        }, 3000);
    }

    handleCancelClientType(): void {
        this.isVisibleClientType = false;
    }

    method(value) {
        this.paymentMethod = value;
    }

     //Test Search Code

     searchUnR(value: string): void {
      console.log(value);
      if (value === ' ' || !value) {
        this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts;

      }

      this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts.filter((client) => {
          return (
            client.policyNumber.toLowerCase().includes(value.toLowerCase()) ||
            client.client.toLowerCase().includes(value.toLowerCase())

          );
      });
  }

  searchR(value: string): void
  {
    console.log(value);
    if (value === ' ' || !value)
    {
      this.displayReceiptedList = this.receiptedList;

    }

    this.displayReceiptedList = this.receiptedList.filter((receip) =>
    {
        return (
          receip.receipt_number.toLowerCase().includes(value.toLowerCase()) ||
          receip.on_behalf_of.toLowerCase().includes(value.toLowerCase())

        );
    });
}

searchCR(value: string): void
{
  if (value === ' ' || !value)
  {
      this.displayCancelledReceiptList = this.cancelReceiptList;
  }

  this.displayCancelledReceiptList = this.cancelReceiptList.filter((receip) =>
    {
        return (
          receip.receipt_number.toLowerCase().includes(value.toLowerCase()) ||
          receip.on_behalf_of.toLowerCase().includes(value.toLowerCase())

        );
    });

}
}
