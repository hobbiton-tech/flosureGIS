import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Policy } from '../../../../../underwriting/models/policy.model';
import { IReceiptModel } from '../../../models/receipts.model';
import { DebitNote } from '../../../../../underwriting/documents/models/documents.model';
import { UserModel } from '../../../../../users/models/users.model';
import { AccountService } from '../../../../services/account.service';
import { PoliciesService } from '../../../../../underwriting/services/policies.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { UsersService } from '../../../../../users/services/users.service';
import { HttpClient } from '@angular/common/http';
import { ClientsService } from '../../../../../clients/services/clients.service';
import _ from 'lodash';
import { TransactionModel } from '../../../../../clients/models/client.model';
import { TransactionInvoiceService } from '../../../../services/transaction-invoice.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-salvage-receipt',
  templateUrl: './salvage-receipt.component.html',
  styleUrls: ['./salvage-receipt.component.scss']
})
export class SalvageReceiptComponent implements OnInit {

  receiptForm: FormGroup;
  cancelForm: FormGroup;
  reinstateForm: FormGroup;
  submitted = false;
  receiptsCount = 0;

  unreceiptedList: any[];
  displayUnreciptedList: any[];

  receiptedList: IReceiptModel[] = [];
  displayReceiptedList: IReceiptModel[] = [];

  cancelledReceiptList: IReceiptModel[] = [];
  displayCancelledReceiptList: IReceiptModel[] = [];

  receiptObj: IReceiptModel = new IReceiptModel();
  receipt: IReceiptModel;
  today = new Date();
  clientName = '';
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
  _id = '';


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
  debitnoteList: any[] = [];
  debitnote: any;
  currency: string;
  user: UserModel;
  isConfirmLoading = false;
  loggedIn = localStorage.getItem('currentUser');
  clientCode: any;
  transaction: any;

  constructor(
    private receiptService: AccountService,
    private policeServices: PoliciesService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private usersService: UsersService,
    private http: HttpClient,
    private clientsService: ClientsService,
    private transactionInvoiceService: TransactionInvoiceService,
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


    this.transactionInvoiceService.getTransactiont().subscribe((salvageInvoices) => {
      console.log('CHECK RECEIPTS>>>>', salvageInvoices);
      this.unreceiptedList = _.filter(
        salvageInvoices.data,
        (x) =>
          x.status === 'Approved');
      const decodedJwtData = jwt_decode(this.loggedIn);

      this.usersService.getUsers().subscribe((users) => {
        this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];
      });
      this.displayUnreciptedList = this.unreceiptedList;

      this.receiptsCount = _.filter(
        salvageInvoices.data,
        (x) =>
          x.status === 'Approved'
      ).length;
      console.log('======= Unreceipt List =======');
      console.log(this.unreceiptedList);

    });

    // this.policeServices.getDebitNotes().subscribe((invoice) => {
    //   this.debitnoteList = invoice;
    // });

    this.receiptService.getReciepts().subscribe((receipts) => {
      this.receiptedList = _.filter(
        receipts.data,
        (x) =>
          x.receipt_status === 'Receipted' &&
          x.source_of_business === 'Salvage'
      );
      this.displayReceiptedList = this.receiptedList;
      console.log('======= Receipt List =======');
      console.log(receipts.data);

      this.cancelReceiptList = _.filter(
        receipts.data,
        (x) =>
          x.receipt_status === 'Cancelled' &&
          x.source_of_business === 'Salvage'
      );
      this.displayCancelledReceiptList = this.cancelReceiptList;

      console.log('======= Cancelled Receipt List =======');
      console.log(this.cancelReceiptList);

      this.receiptNewCount = receipts.length;
      console.log('Total Number of Receipts>>>>', this.receiptNewCount);
    });

  }

  showModal(unreceipted: any): void {
    this.isVisible = true;
    this.clientName = unreceipted.client_name;
    // this.user = unreceipted.user;
    this.debitnote = this.unreceiptedList.filter((x) => x.ID === unreceipted.ID)[0];
    this.policyAmount = unreceipted.amount;
    // this.clientCode = unreceipted.clientCode;
    // this.currency = unreceipted.currency;
    // this.sourceOfBusiness = unreceipted.sourceOfBusiness;
    // this.intermediaryName = unreceipted.intermediaryName;
    // console.log(this.policyAmount);
  }

  get receiptFormControl() {
    return this.receiptForm.controls;
  }

  async handleOk() {
    this.submitted = true;
    // console.log('DEBIT NOTE NUMBER>>>>>', this.debitnote.debitNoteNumber);
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
        on_behalf_of: this.debitnote.client_name,
        captured_by: this.user.ID,
        receipt_status: this.recStatus,
        sum_in_digits: Number(this.policyAmount),
        today_date: new Date(),
        invoice_number: this.debitnote.invoice_number,
        source_of_business: 'Salvage',
        intermediary_name: '',
        currency: 'ZMW',
      };


      this.debitnote.status = 'Receipted';

      this.receiptNum = this._id;
      // await this.receiptService
      //     .addReceipt(receipt, this.policy.risks[0].insuranceType).subscribe((mess) => {
      //         this.message.success('Receipt Successfully created');
      //         console.log('QQQQQQ', mess);
      //         this.policeServices.updatePolicy(this.policy).subscribe((res) => {}, (err) => {
      //         console.log('Update Policy Error', err); });
      //     },
      //     (err) => {
      //         this.message.warning('Receipt Failed');
      //         console.log(err);
      //     });


      this.http.get<any>(
        `https://number-generation.flosure-api.com/golden-lotus-receipt-number`
      )
        .subscribe(async (res) => {
          receipt.receipt_number = res.data.receipt_number;
          console.log(res.data.receipt_number);

          this.http.post('https://pay-api.goldenlotusinsurance.com/receipt', receipt).subscribe((resN: any) => {
              this.message.success('Receipt Successfully created');
              console.log('RECEIPT NUMBER<><><><>', resN);

              this.transactionInvoiceService.updateTransaction(this.debitnote).subscribe((resP) => {}, (err) => {
                console.log('Update Invoice Error', err);
              });


              // this.clientsService.getTransactions().subscribe((txns: any) => {
              //   let balanceTxn = 0;
              //   console.log('DEDEDE', txns);
              //   const filterTxn = txns.data.filter((x) => x.client_id === this.clientCode);
              //
              //   if (filterTxn === null || filterTxn === undefined || filterTxn === [] || filterTxn.length === 0) {
              //     balanceTxn = Number(resN.data.sum_in_digits) * -1;
              //   } else {
              //     this.transaction = filterTxn.slice(-1)[0];
              //
              //     console.log('DEDEDE', this.transaction);
              //
              //     balanceTxn = Number(this.transaction.balance) + Number(resN.data.sum_in_digits * -1);
              //   }
              //
              //
              //   const trans: TransactionModel = {
              //     open_cash: 0,
              //     balance: Number(balanceTxn),
              //     client_id: this.clientCode,
              //     cr: Number(resN.data.sum_in_digits * -1),
              //     receipt_id: resN.data.ID,
              //     dr: 0,
              //     transaction_amount: Number(resN.data.sum_in_digits * -1),
              //     transaction_date: new Date(),
              //     type: 'Receipt',
              //     reference: resN.data.receipt_number
              //
              //   };
              //
              //   this.clientsService.createTransaction(trans).subscribe((sucTxn) => {}, (errTxn) => {
              //     this.message.error(errTxn);
              //   });
              // });

              this.generateID(resN.data.ID);

            },
            err => {
              this.message.warning('Receipt Failed');
              console.log(err);
            });



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

  // Test Search Code

  searchUnR(value: string): void {
    console.log(value);
    if (value === ' ' || !value) {
      this.displayUnreciptedList = this.unreceiptedList;

    }

    this.displayUnreciptedList = this.unreceiptedList.filter((client) => {
      return (
        client.invoice_number.toLowerCase().includes(value.toLowerCase()) ||
        client.client_name.toLowerCase().includes(value.toLowerCase())

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
