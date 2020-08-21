import { Component, OnInit } from '@angular/core';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { AccountService } from '../../services/account.service';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IReceiptModel } from '../models/receipts.model';
import { NzMessageService } from 'ng-zorro-antd';
import { v4 } from 'uuid';
import { IReceiptDTO } from 'src/app/quotes/models/receipt.dto';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Policy } from 'src/app/underwriting/models/policy.model';
import {
    IAgent,
    IBroker,
} from 'src/app/settings/components/agents/models/agents.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import { AllocationsService } from '../../services/allocations.service';
import { AllocationReceipt } from '../models/allocations.model';

@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    receiptsCount = 0;
    unreceiptedList: Policy[];
    receiptedList: IReceiptModel[];
    brokerList: IBroker[];
    receipt: IReceiptModel;
    today = new Date();
    clientName = '';
    policy: Policy = new Policy();
    size = 'large';

    recStatus = 'Receipted';

    receiptNum = '';

    policyAmount = 0;
    cancelReceiptList = [];

    isVisibleBrokerReceipting = false;
    isCancelVisible = false;
    isReinstateVisible = false;
    isOkBrokerReceiptingLoading = false;
    policyNumber = '';
    user = '';
    _id = '';
    isVisibleClientType = false;
    isOkClientTypeLoading = false;

    // modal
    isReceiptVisible = false;
    isConfirmLoading = false;


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
    ];

    typeOfClient = ['Direct', 'Agent', 'Broker', 'Sales Representatives', 'Plan Receipt'];

    selectedType = 'Direct';
    selectedAgent = '';
    receiptNewCount: number;

    // allocationReceipt: AllocationReceipt;

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router,
        private agentService: AgentsService, private allocationService: AllocationsService, private http: HttpClient,
    ) {
        this.receiptForm = this.formBuilder.group({
          received_from: ['', Validators.required],
          on_behalf_of: ['', Validators.required],
          sum_in_digits: ['', Validators.required],
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
        this.agentService.getBrokers().subscribe((brokers) => {
            this.brokerList = brokers;

            console.log('===================');
            console.log(this.brokerList);
        });
        this.receiptService.getPolicies().subscribe((quotes) => {
            this.unreceiptedList = _.filter(
                quotes,
                (x) => x.receiptStatus === 'Unreceipted'
            );
            this.receiptsCount = _.filter(
                quotes,
                (x) => x.receiptStatus === 'Unreceipted'
            ).length;
            console.log('======= Unreceipt List =======');
            console.log(this.unreceiptedList);
        });

        this.receiptService.getReciepts().subscribe((receipts) => {
            this.receiptedList = _.filter(
                receipts,
                (x) => x.receipt_status === 'Receipted'
            );

            console.log('======= Receipt List =======');
            console.log(this.receiptedList);

            this.cancelReceiptList = _.filter(
                receipts,
                (x) => x.receipt_status === 'Cancelled'
            );

            console.log('======= Cancelled Receipt List =======');
            console.log(this.cancelReceiptList);
            this.receiptNewCount = receipts.length;
        });
    }

    showBrokerReceiptModal(): void {
        this.isVisibleBrokerReceipting = true;
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    async handleOkBrokerReceipting() {
        this.submitted = true;
        if (this.receiptForm.valid) {
            this.isOkBrokerReceiptingLoading = true;
            this._id = v4();
            const receipt: IReceiptModel = {
              received_from: this.receiptForm.controls.received_from.value,
              payment_method: this.receiptForm.controls.payment_method.value,
              receipt_type: this.receiptForm.controls.receipt_type.value,
              narration: this.receiptForm.controls.narration.value,
              date_received: new Date(),
              remarks: this.receiptForm.controls.remarks.value,
              cheq_number: this.receiptForm.controls.cheq_number.value,
              on_behalf_of: this.receiptForm.controls.on_behalf_of.value.companyName,
              captured_by: this.user,
              receipt_status: this.recStatus,
              sum_in_digits: this.receiptForm.controls.sum_in_digits.value,
              today_date: new Date(),
              invoice_number: '',
              source_of_business: 'Broker',
              intermediary_name: this.receiptForm.controls.on_behalf_of.value.companyName,
            };

            const allocationReceipt: AllocationReceipt = {
              allocated_amount: 0,
              amount: this.receiptForm.controls.sum_in_digits.value,
              intermediary_id: this.receiptForm.controls.on_behalf_of.value.id,
              intermediary_name: this.receiptForm.controls.on_behalf_of.value.companyName,
              intermediary_type: 'Broker',
              receipt_number: '',
              status: 'Unallocated'
            };

            this.http
            .get<any>(
              `https://number-generation.flosure-api.com/savenda-receipt-number/1`
            )
            .subscribe(async (res) => {
              receipt.receipt_number = res.data.receipt_number;
              console.log(res.data.receipt_number);

              this.http.post('https://payment-api.savenda-flosure.com/receipt', receipt).subscribe((resN: any) => {
                  this.message.success('Receipt Successfully created');
                  console.log('RECEIPT NUMBER<><><><>', resN);

                  allocationReceipt.receipt_number = resN.data.receipt_number;
                  this.allocationService.createAllocationReceipt(allocationReceipt).subscribe((resMess) => {}, (errMess) => {
                    this.message.warning('Allocate Receipt Failed');
                  });
                  this.generateID(this._id);

                },
                err => {
                  this.message.warning('Receipt Failed');
                  console.log(err);
                });
            });

            this.receiptForm.reset();
            setTimeout(() => {
                this.isVisibleBrokerReceipting = false;
                this.isOkBrokerReceiptingLoading = false;
            }, 3000);
        }
    }

    handleCancelBrokerReceipting(): void {
        this.isVisibleBrokerReceipting = false;
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
        this.isVisibleClientType = false;
    }

    handleCancelClientType(): void {
        this.isVisibleClientType = false;
    }
}
