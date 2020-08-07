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
    cancelledReceiptList: IReceiptModel[];
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

    // modal
    isReceiptVisible = false;
    isConfirmLoading = false;
    showDocumentModal = false;
    isReceiptApproved = false;

    // generated PDFs
    receiptURl = '';
    showReceiptModal = false;
    receiptNewCount: number;
    paymentMethod = '';

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

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private policeServices: PoliciesService,
        private router: Router,
        private agentService: AgentsService
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
        this.refresh()
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
            x.sourceOfBusiness === 'salesRepresentative'
        );

        this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts;

        this.receiptsCount = _.filter(
          quotes,
          (x) =>
            x.receiptStatus === 'Unreceipted' &&
            x.sourceOfBusiness === 'salesRepresentative'
        ).length;
        console.log('======= Unreceipt List =======');
        console.log(this.listofUnreceiptedReceipts);
      });

      this.policeServices.getDebitNotes().subscribe((invoice) => {
        this.debitnoteList = invoice;
      });

      this.receiptService.getReciepts().subscribe((receipts) => {
        this.receiptedList = _.filter(
          receipts.data,
          (x) =>
            x.receipt_status === 'Receipted' &&
            x.source_of_business === 'salesRepresentative'
        );

        console.log('======= Receipt List =======');
        console.log(this.receiptedList);

        this.cancelReceiptList = _.filter(
          receipts.data,
          (x) =>
            x.receipt_status === 'Cancelled' &&
            x.source_of_business === 'salesRepresentative'
        );

        console.log('======= Cancelled Receipt List =======');
        console.log(this.cancelReceiptList);
        this.receiptNewCount = receipts.length;
      });
    }

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

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

          this.policy.receiptStatus = 'Receipted';
          this.policy.paymentPlan = 'Created';
            this.receiptNum = this._id;
            await this.receiptService
                .addReceipt(receipt, this.policy.risks[0].insuranceType).subscribe((mess) => {
                    this.message.success('Receipt Successfully created');
                    console.log(mess);
                  this.policeServices.updatePolicy(this.policy).subscribe((res) => {}, (err) => {
                    console.log('Update Policy Error', err);});
                },
                (err) => {
                    this.message.warning('Receipt Failed');
                    console.log(err);
                });
                // .then((mess) => {
                //     this.policy.receiptStatus = 'Receipted';
                //     this.policy.paymentPlan = 'Created';

                //     .subscribe();
                //     console.log(mess);
                // })
                // .catch((err) => {
                //     this.message.warning('Receipt Failed');
                //     console.log(err);
                // });
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
          this.refresh()
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
          this.refresh()
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
}
