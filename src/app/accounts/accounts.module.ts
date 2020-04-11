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
    }
];

@NgModule({
    declarations: [
        ReceiptsGenerationComponent,
        ViewReceiptsComponent,
        PaymentsComponent,
        ReceiptsComponent,
        PaymentPlanComponent,
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
        PdfViewerModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [AccountService],
})
export class AccountsModule {}
