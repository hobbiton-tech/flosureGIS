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
import { PlanReceiptComponent } from './components/receipts/components/plan-receipt/plan-receipt.component';
import { CommissionPaymentComponent } from './components/commission-payment/commission-payment.component';
import { PaymentPlanService } from './services/payment-plan.service';

const routes: Routes = [
    {
        path: 'generate-receipts',
        component: ReceiptsGenerationComponent,
    },
    {
        path: 'receipts',
        component: ReceiptsComponent,
    },
    {
        path: 'payments',
        component: PaymentsComponent,
    },
    {
        path: 'payment-plan',
        component: PaymentPlanComponent,
    },
    {
        path: 'payment-plan/:id',
        component: PaymentPlanPolicyInstallmentsComponent,
    },
    {
        path: 'view-receipt/:id',
        component: ViewReceiptsComponent,
    },
    {
        path: 'direct-client',
        component: DirectClientComponent,
    },
    {
        path: 'broker',
        component: BrokerClientComponent,
    },
    {
        path: 'agent',
        component: AgentClientComponent,
    },
    {
        path: 'sales-representative',
        component: SalesRepresentativeClientComponent,
    },

  {
    path: 'plan-receipt',
    component: PlanReceiptComponent,
  },

  {
    path: 'commission-payment',
    component: CommissionPaymentComponent,
  },
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
        PlanReceiptComponent,
        CommissionPaymentComponent,
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
        PdfViewerModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [AccountService, PaymentPlanService],
})
export class AccountsModule {}
