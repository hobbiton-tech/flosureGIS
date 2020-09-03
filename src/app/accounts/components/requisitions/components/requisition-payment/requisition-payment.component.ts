import {
    Component,
    OnInit,
    Input,
    Output,
    OnDestroy,
    ɵConsole
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { IRequisitionPayment } from 'src/app/settings/models/requisition-payment.model';
import { PaymentService } from 'src/app/settings/components/finance/services/payment.service';
import { BankAccountsService } from 'src/app/settings/components/finance/services/bank-accounts.service';
import {
    IBankAccount,
    BankAccountType
} from 'src/app/settings/models/bank-account.model';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/services/account.service';
import { IRequisitionModel } from '../../../models/requisition.model';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { IChequeModel } from 'src/app/settings/models/cheque.model';

@Component({
    selector: 'app-requisition-payment',
    templateUrl: './requisition-payment.component.html',
    styleUrls: ['./requisition-payment.component.scss']
})
export class RequisitionPaymentComponent implements OnInit, OnDestroy {
    paymentVoucherNumberSubscription: Subscription;
    payeeSubscription: Subscription;
    requisitionAmountSubscription: Subscription;
    requisitionIdSubscription: Subscription;
    requisitionCurrencySubscription: Subscription;

    @Input()
    isRequisitionPaymentModalVisible: boolean;

    @Output()
    closeRequisitionPaymentModalEmitter: EventEmitter<any> = new EventEmitter();

    isPaymentProcesseing: boolean = false;

    chequeList: IChequeModel[] = [];
    filteredChequeList: IChequeModel[] = [];

    singleChequeRange: IChequeModel;

    chequeLots: string[] = [];

    voucherNumber: string;
    payee: string;
    requisitionAmount: number;
    requisitionCurrency: string;

    // requisition
    requisition: IRequisitionModel;

    requisitionId: string;

    // bank accounts
    bankAccounts: IBankAccount[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private paymentsService: PaymentService,
        private bankAccountsService: BankAccountsService,
        private accountsService: AccountService,
        private msg: NzMessageService,
        private readonly router: Router
    ) {
        this.requisitionPaymentForm = this.formBuilder.group({
            voucherNumber: ['', Validators.required],
            date: ['', Validators.required],
            bankAccount: ['', Validators.required],
            amount: ['', Validators.required],
            payee: ['', Validators.required],
            paymentType: ['', Validators.required],
            specialInstructions: ['', Validators.required],
            narrative: ['', Validators.required],
            chequeLot: ['', Validators.required]
        });

        this.paymentVoucherNumberSubscription = this.accountsService.voucherNumberChanged$.subscribe(
            voucherNumber => {
                this.voucherNumber = voucherNumber;
                this.requisitionPaymentForm
                    .get('voucherNumber')
                    .setValue(this.voucherNumber);
            }
        );

        this.payeeSubscription = this.accountsService.payeeChanged$.subscribe(
            payee => {
                this.payee = payee;
                this.requisitionPaymentForm.get('payee').setValue(this.payee);
            }
        );

        this.requisitionAmountSubscription = this.accountsService.requisitionAmountChanged.subscribe(
            requisitionAmount => {
                this.requisitionAmount = requisitionAmount;
                this.requisitionPaymentForm
                    .get('amount')
                    .setValue(this.requisitionAmount);
            }
        );

        this.requisitionIdSubscription = this.accountsService.requisitionIdChanged$.subscribe(
            requisitionId => {
                this.requisitionId = requisitionId;
            }
        );

        this.requisitionCurrencySubscription = this.accountsService.requisitionCurrencyChanged$.subscribe(
            requisitionCurrency => {
                this.requisitionCurrency = requisitionCurrency;
            }
        );
    }

    selectedPaymentType = { value: '' };

    requisitionPaymentForm: FormGroup;

    ngOnInit(): void {
        this.bankAccountsService
            .getBankAccounts()
            .subscribe(bankAccounts => (this.bankAccounts = bankAccounts));

        this.accountsService
            .getRequisitionById(this.requisitionId)
            .subscribe(requisition => {
                this.requisition = requisition;
            });

        this.bankAccountsService.getChequeRanges().subscribe(chequeRanges => {
            this.chequeList = chequeRanges;
            this.filteredChequeList = this.chequeList;
        });
    }

    closeRequisitionPaymentModal() {
        this.closeRequisitionPaymentModalEmitter.emit(true);
    }

    changeSelectedPaymentType() {
        const paymentType = this.requisitionPaymentForm.get('paymentType')
            .value;

        this.selectedPaymentType = {
            value: paymentType
        };
    }

    changeChequeList() {
        const bankDetails: IBankAccount = this.requisitionPaymentForm.get(
            'bankAccount'
        ).value;

        this.filteredChequeList = this.chequeList.filter(
            chequeRange => chequeRange.bankAccount.id == bankDetails.id
        );

        this.chequeLots = this.filteredChequeList.map(x => x.chequeLot);
    }

    changeChequeLot() {
        const chequeLot = this.requisitionPaymentForm.get('chequeLot').value;

        this.singleChequeRange = this.filteredChequeList.filter(
            cheques => cheques.chequeLot == chequeLot
        )[0];

        this.requisitionPaymentForm
            .get('specialInstructions')
            .setValue(this.singleChequeRange.chequeNextCount);
    }

    processPayment() {
        this.isPaymentProcesseing = true;
        const requisitionPayment: IRequisitionPayment = {
            ...this.requisitionPaymentForm.value,
            requestDate: new Date(),
            approvalSatus: 'Pending',
            preparedBy: localStorage.getItem('user'),
            currency: this.requisitionCurrency
        };

        const requisitionUpdate: IRequisitionModel = {
            ...this.requisition,
            paymentStatus: 'Processed'
        };

        const bankAccount: IBankAccount = this.requisitionPaymentForm.get(
            'bankAccount'
        ).value;

        this.paymentsService
            .createRequisitionPayment(bankAccount.id, requisitionPayment)
            .subscribe(
                x => {
                    console.log(x);
                    this.accountsService
                        .updateRequisition(
                            this.requisitionId,
                            requisitionUpdate
                        )
                        .subscribe(x => {
                            console.log(x);
                        });

                    if (this.selectedPaymentType.value == 'Cheque') {
                        // update cheque number to next sequence
                        const chequeUpdate: IChequeModel = {
                            ...this.singleChequeRange,
                            chequeNextCount:
                                this.singleChequeRange.chequeNextCount + 1
                        };

                        this.bankAccountsService.updateChequeRange(
                            chequeUpdate,
                            this.singleChequeRange.id
                        );
                    }
                    this.msg.success('Payment Processed');
                    this.isPaymentProcesseing = false;

                    // this.router.navigateByUrl('/flosure/accounts/payments');

                    // this.isRequisitionPaymentModalVisible = false;
                    this.closeRequisitionPaymentModal();
                },
                err => {
                    console.log(err);
                    this.msg.error('Payment Processing Failed');
                    this.isPaymentProcesseing = false;
                    this.isRequisitionPaymentModalVisible = false;
                }
            );
    }

    ngOnDestroy() {
        this.paymentVoucherNumberSubscription.unsubscribe();
        this.payeeSubscription.unsubscribe();
        this.requisitionAmountSubscription.unsubscribe();
        this.requisitionIdSubscription.unsubscribe();
    }
}
