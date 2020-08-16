import { Component, OnInit, Input } from '@angular/core';
import { IRequisitionPayment } from 'src/app/settings/models/requisition-payment.model';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';

@Component({
    selector: 'app-payment-requisition-voucher',
    templateUrl: './payment-requisition-voucher.component.html',
    styleUrls: ['./payment-requisition-voucher.component.scss']
})
export class PaymentRequisitionVoucherComponent implements OnInit {
    @Input()
    paymentDetails: IRequisitionPayment;

    @Input()
    payee: IIndividualClient & ICorporateClient;

    constructor() {}

    ngOnInit(): void {}
}
