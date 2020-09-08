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
import { CommissionPaymentService } from './services/commission-payment.service';
import { AllocationsService } from './services/allocations.service';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';
import { ClientStatementsComponent } from './components/statements/client-statements/client-statements.component';

const routes: Routes = [
    {
        path: 'generate-receipts',
        component: ReceiptsGenerationComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'receipts',
        component: ReceiptsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'requisitions',
        component: RequisitionsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'requisitions/approved-requisitions',
        component: ApprovedRequisitionsComponent
    },
    {
        path: 'payments',
        component: PaymentsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'payments/approved-payments',
        component: ApprovedPaymentsComponent
    },
    {
        path: 'payment-plan',
        component: PaymentPlanComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'payment-plan/:id',
        component: PaymentPlanPolicyInstallmentsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'view-receipt/:id',
        component: ViewReceiptsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'direct-client',
        component: DirectClientComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'broker',
        component: BrokerClientComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'agent',
        component: AgentClientComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'sales-representative',
        component: SalesRepresentativeClientComponent,
      canActivate: [AuthGuard],
    },

  {
    path: 'plan-receipt',
    component: PlanReceiptComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'commission-payment',
    component: CommissionPaymentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'allocations',
    component: AllocationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client-statement',
    component: ClientStatementsComponent,
    canActivate: [AuthGuard],
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
        RequisitionsComponent,
        RequisitionPaymentComponent,
        PaymentRequisitionVoucherComponent,
        PlanReceiptComponent,
        CommissionPaymentComponent,
        AllocationsComponent,
        ApprovedRequisitionsComponent,
        ApprovedPaymentsComponent,
        ClientStatementsComponent
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
    providers: [
        AccountService,
        PaymentPlanService,
        CommissionPaymentService,
        AllocationsService
    ]
})
export class AccountsModule {}
