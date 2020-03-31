import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReceiptsGenerationComponent } from './components/receipts-generation/receipts-generation.component';
import { ViewReceiptsComponent } from './components/view-receipts/view-receipts.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AccountService } from './services/account.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReceiptsComponent } from './components/receipts/receipts.component';

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
        path: 'payments',
        component: PaymentsComponent
    }
];

@NgModule({
    declarations: [
        AccountsComponent,
        ReceiptsGenerationComponent,
        ViewReceiptsComponent,
        PaymentsComponent,
        ReceiptsComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
        PdfViewerModule
    ],
    providers: [AccountService]
})
export class AccountsModule {}
