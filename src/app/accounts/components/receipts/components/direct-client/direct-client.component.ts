import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { IReceiptModel } from '../../../models/receipts.model';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import _ from 'lodash';
import { v4 } from 'uuid';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';
import { th } from 'date-fns/locale';

@Component({
    selector: 'app-direct-client',
    templateUrl: './direct-client.component.html',
    styleUrls: ['./direct-client.component.scss'],
})
export class DirectClientComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    receiptsCount = 0;

    unreceiptedList: Policy[];
    displayUnreciptedList: Policy[];

    receiptedList: IReceiptModel[] = [];
    displayReceiptedList: IReceiptModel[] = [];

    cancelledReceiptList: IReceiptModel[] = [];
    displayCancelledReceiptList: IReceiptModel[] = [];

    receiptObj: IReceiptModel = new IReceiptModel();
    receipt: IReceiptModel;
    today = new Date();
    clientName = '';
    policy: Policy = new Policy();
    cancelReceipt: IReceiptModel = new IReceiptModel();
    reinstateReceipt: IReceiptModel = new IReceiptModel();
    size = 'large';
    paymentMethod = '';

    recStatus = 'Receipted';
    // Test Filter List
    searchString: string;



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
    // modal
    isReceiptVisible = false;
    isConfirmLoading = false;
    showDocumentModal = false;
    isReceiptApproved = false;

    // generated PDFs
    receiptURl = '';
    showReceiptModal = false;
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
    sourceOfBusiness: string;
    intermediaryName: string;
    receiptNewCount: number;
    debitnoteList: DebitNote[] = [];
    debitnote: DebitNote;
    currency: string;

    constructor(
        private receiptService: AccountService,
        private policeServices: PoliciesService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router
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


      this.policeServices.getPolicies().subscribe((quotes) => {
        console.log('CHECK RECEIPTS>>>>', quotes);
        this.unreceiptedList = _.filter(
          quotes,
          (x) =>
            x.receiptStatus === 'Unreceipted' &&
            x.sourceOfBusiness === 'direct'
        );
        this.displayUnreciptedList = this.unreceiptedList;

        this.receiptsCount = _.filter(
          quotes,
          (x) =>
            x.receiptStatus === 'Unreceipted' &&
            x.sourceOfBusiness === 'direct'
        ).length;
        console.log('======= Unreceipt List =======');
        console.log(this.unreceiptedList);

      });

      this.policeServices.getDebitNotes().subscribe((invoice) => {
        this.debitnoteList = invoice;
      });

      this.receiptService.getReciepts().subscribe((receipts) => {
        this.receiptedList = _.filter(
          receipts.data,
          (x) =>
            x.receipt_status === 'Receipted' &&
            x.source_of_business === 'direct'
        );
        this.displayReceiptedList = this.receiptedList;
        console.log('======= Receipt List =======');
        console.log(receipts.data);

        this.cancelReceiptList = _.filter(
          receipts.data,
          (x) =>
            x.receipt_status === 'Cancelled' &&
            x.source_of_business === 'direct'
        );
        this.displayCancelledReceiptList = this.cancelReceiptList;

        console.log('======= Cancelled Receipt List =======');
        console.log(this.cancelReceiptList);

        this.receiptNewCount = receipts.length;
        console.log('Total Number of Receipts>>>>', this.receiptNewCount);
      });

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
                    console.log('Update Policy Error', err);})
                },
                (err) => {
                    this.message.warning('Receipt Failed');
                    console.log(err);
                });
                // .then((mess) => {
                //     this.policy.receiptStatus = 'Receipted';
                //     this.policy.paymentPlan = 'Created';

                //     // this.policeServices.updatePolicy(this.policy).subscribe();
                // })
                // .catch((err) => {
                //     this.message.warning('Receipt Failed');
                //     console.log('Receipt failed>>>>',err);
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
        this.receiptService.updateReceipt(this.cancelReceipt).subscribe((res) => {
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
      this.receiptService.updateReceipt(this.reinstateReceipt).subscribe((res) => {
        this.message.success('Receipt Successfully Updated');
        this.refresh();
        // const cancel: any[] = res.data.filter((x) => {
        //   x.receipt_status === 'Cancelled' &&
        //   x.source_of_business === 'Plan-Receipt';
        // });
        // this.cancelReceiptList = [...cancel];
      }, (err) => {
        console.log('Check ERR>>>>', err);
        this.message.warning('Receipt Failed');
      });
        this.isReinstateVisible = false;
    }

    // pop Confirm
    cancel() {}

    generateID(id: number) {
        console.log('++++++++++++ID++++++++++++', id);
        console.log(id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }

    paymentMethodChange(value) {
        console.log('ON CHANGE>>>>', value);
        this.paymentMethod = value;
    }

    //Test Search Code

    searchUnR(value: string): void {
      console.log(value);
      if (value === ' ' || !value) {
        this.displayUnreciptedList = this.unreceiptedList;

      }

      this.displayUnreciptedList = this.unreceiptedList.filter((client) => {
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
