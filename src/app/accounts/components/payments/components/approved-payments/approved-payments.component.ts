import { Component, OnInit } from '@angular/core';
import { IRequisitionPayment } from 'src/app/settings/models/requisition-payment.model';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';
import { BehaviorSubject } from 'rxjs';
import { PaymentService } from 'src/app/settings/components/finance/services/payment.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-approved-payments',
    templateUrl: './approved-payments.component.html',
    styleUrls: ['./approved-payments.component.scss']
})
export class ApprovedPaymentsComponent implements OnInit {
    columnAlignment = 'center';
    paymentsIsLoading = false;
    isApprovingPayment = false;

    // Payment requisition Voucher PDF
    isViewPaymentRequisitionVoucherPDFVisible = false;

    paymentsList: IRequisitionPayment[] = [];
    pendingPaymentsList: IRequisitionPayment[] = [];
    displayPendingPaymentsList: IRequisitionPayment[] = [];

    approvedPaymentsList: IRequisitionPayment[] = [];
    displayApprovedPaymentsList: IRequisitionPayment[] = [];

    // client details
    client: IIndividualClient & ICorporateClient;
    clientsList: Array<IIndividualClient & ICorporateClient>;

    searchString: string;

    requisitionPayment: IRequisitionPayment;

    paymentApprovalUpdate = new BehaviorSubject<boolean>(false);

    constructor(
        private paymentsService: PaymentService,
        private clientsService: ClientsService,
        private msg: NzMessageService
    ) {}

    ngOnInit(): void {
        this.paymentsIsLoading = true;
        // setTimeout(() => {
        //     this.paymentsIsLoading = false;
        // }, 3000);

        this.paymentsService.getRequisitionPayments().subscribe(payments => {
            this.paymentsList = payments;
            this.pendingPaymentsList = this.paymentsList.filter(
                x => x.approvalSatus == 'Pending'
            );
            this.displayPendingPaymentsList = this.pendingPaymentsList;

            this.approvedPaymentsList = this.paymentsList.filter(
                x => x.approvalSatus == 'Approved'
            );
            this.displayApprovedPaymentsList = this.approvedPaymentsList;

            this.paymentsIsLoading = false;
        });

        this.paymentApprovalUpdate.subscribe(update => {
            update === true ? this.updatePaymentsTables() : '';
        });
    }

    approvePayment(requisitionPayment: IRequisitionPayment) {
        this.isApprovingPayment = true;
        const payment: IRequisitionPayment = {
            ...requisitionPayment,
            approvalSatus: 'Approved',
            authorizedBy: localStorage.getItem('user'),
            authorizationDate: new Date()
        };

        this.paymentsService
            .updateRequisitionPayment(payment, requisitionPayment.id)
            .subscribe(
                res => {
                    console.log(res);

                    this.paymentApprovalUpdate.next(true);
                    this.msg.success('Payment Approved');
                    this.isApprovingPayment = false;
                },
                err => {
                    console.log(err);
                    this.msg.error('Payment Aprroval Failed');
                    this.isApprovingPayment = false;
                }
            );
    }

    updatePaymentsTables() {
        this.paymentsService.getRequisitionPayments().subscribe(payments => {
            this.paymentsList = payments;
            this.pendingPaymentsList = this.paymentsList.filter(
                x => x.approvalSatus == 'Pending'
            );
            this.displayPendingPaymentsList = this.pendingPaymentsList;

            this.approvedPaymentsList = this.paymentsList.filter(
                x => x.approvalSatus == 'Approved'
            );
            this.displayApprovedPaymentsList = this.approvedPaymentsList;
        });
    }

    viewPaymentVoucher(payment: IRequisitionPayment) {
        this.clientsService.getAllClients().subscribe(clients => {
            this.clientsList = [...clients[0], ...clients[1]] as Array<
                ICorporateClient & IIndividualClient
            >;

            this.client = this.clientsList.filter(
                x =>
                    (x.clientType == 'Individual'
                        ? x.firstName + ' ' + x.lastName
                        : x.companyName) === payment.payee
            )[0] as IIndividualClient & ICorporateClient;

            console.log('client', this.client);

            this.requisitionPayment = payment;
            console.log('payment details', this.requisitionPayment);
            this.isViewPaymentRequisitionVoucherPDFVisible = true;
        });
    }

    searchPendingPayments(value: string) {}

    searchProcessedPayments(value: string) {
        if (value === '' || !value) {
            this.displayApprovedPaymentsList = this.approvedPaymentsList;
        }

        this.displayApprovedPaymentsList = this.approvedPaymentsList.filter(
            payment => {
                return (
                    payment.voucherNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    payment.approvalSatus
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        );
    }
}