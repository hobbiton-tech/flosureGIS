import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReceiptsGenerationComponent } from './components/receipts-generation/receipts-generation.component';
import { ViewReceiptsComponent } from './components/view-receipts/view-receipts.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AccountService } from './services/account.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReceiptsComponent } from './components/receipts/receipts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentPlanComponent } from './components/payment-plan/payment-plan.component';
import { PaymentPlanPolicyInstallmentsComponent } from './components/payment-plan/components/payment-plan-policy-installments/payment-plan-policy-installments.component';
import { ReceiptDocumentComponent } from './components/receipts/documents/receipt-document/receipt-document.component';
import { DirectClientComponent } from './components/receipts/components/direct-client/direct-client.component';
import { BrokerClientComponent } from './components/receipts/components/broker-client/broker-client.component';
import { AgentClientComponent } from './components/receipts/components/agent-client/agent-client.component';
import { SalesRepresentativeClientComponent } from './components/receipts/components/sales-representative-client/sales-representative-client.component';
import { RequisitionsComponent } from './components/requisitions/requisitions.component';
import { RequisitionPaymentComponent } from './components/requisitions/components/requisition-payment/requisition-payment.component';
import { PaymentRequisitionVoucherComponent } from './components/payments/documents/payment-requisition-voucher/payment-requisition-voucher.component';
import { NgxPrintModule } from 'ngx-print';
import { PlanReceiptComponent } from './components/receipts/components/plan-receipt/plan-receipt.component';
import { CommissionPaymentComponent } from './components/commission-payment/commission-payment.component';
import { PaymentPlanService } from './services/payment-plan.service';
import { AllocationsComponent } from './components/allocations/allocations.component';
import { ApprovedRequisitionsComponent } from './components/requisitions/components/approved-requisitions/approved-requisitions.component';
import { ApprovedPaymentsComponent } from './components/payments/components/approved-payments/approved-payments.component';

const routes: Routes = [
    {
        path: 'generate-receipts',
        component: ReceiptsGenerationComponent
    },
    {
        path: 'receipts',
        component: ReceiptsComponent
    },
    {
        path: 'requisitions',
        component: RequisitionsComponent
    },
    {
        path: 'requisitions/approved-requisitions',
        component: ApprovedRequisitionsComponent
    },
    {
        path: 'payments',
        component: PaymentsComponent
    },
    {
        path: 'payments/approved-payments',
        component: ApprovedPaymentsComponent
    },
    {
        path: 'payment-plan',
        component: PaymentPlanComponent
    },
    {
        path: 'payment-plan/:id',
        component: PaymentPlanPolicyInstallmentsComponent
    },
    {
        path: 'view-receipt/:id',
        component: ViewReceiptsComponent
    },
    {
        path: 'direct-client',
        component: DirectClientComponent
    },
    {
        path: 'broker',
        component: BrokerClientComponent
    },
    {
        path: 'agent',
        component: AgentClientComponent
    },
    {
        path: 'sales-representative',
        component: SalesRepresentativeClientComponent
    },

    {
        path: 'plan-receipt',
        component: PlanReceiptComponent
    },

    {
        path: 'commission-payment',
        component: CommissionPaymentComponent
    },
    {
        path: 'allocations',
        component: AllocationsComponent
    }
];

@NgModule({
    declarations: [
        ReceiptsGenerationComponent,
        ViewReceiptsComponent,
        PaymentsComponent,
        ReceiptsComponent,
        PaymentPlanComponent,
        PaymentPlanPolicyInstallmentsComponent,
        ReceiptDocumentComponent,
        DirectClientComponent,
        BrokerClientComponent,
        AgentClientComponent,
        SalesRepresentativeClientComponent,
        RequisitionsComponent,
        RequisitionPaymentComponent,
        PaymentRequisitionVoucherComponent,
        PlanReceiptComponent,
        CommissionPaymentComponent,
        AllocationsComponent,
        ApprovedRequisitionsComponent,
        ApprovedPaymentsComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
        PdfViewerModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPrintModule
    ],
    providers: [AccountService, PaymentPlanService]
})
export class AccountsModule {}
