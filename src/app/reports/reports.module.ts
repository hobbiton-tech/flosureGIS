import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ClaimsComponent } from './components/claims/claims.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectClientStatementComponent } from './components/policies/direct-client-statement/direct-client-statement.component';
import { DebtorsAgeAnalysisReportComponent } from './components/policies/debtors-age-analysis-report/debtors-age-analysis-report.component';
import { AgnentBrokerStatementReportComponent } from './components/policies/agnent-broker-statement-report/agnent-broker-statement-report.component';
import { CommissionEarnedStatemnetComponent } from './components/policies/commission-earned-statemnet/commission-earned-statemnet.component';
import { IntermediaryStatementForClientComponent } from './components/policies/intermediary-statement-for-client/intermediary-statement-for-client.component';

const routes: Routes = [
    {
        path: 'claims',
        component: ClaimsComponent,
    },
    {
        path: 'policies',
        component: PoliciesComponent,
    },
    {
        path: 'underwriting',
        component: UnderwritingComponent,
    },
];

@NgModule({
    declarations: [ClaimsComponent, PoliciesComponent, UnderwritingComponent, DirectClientStatementComponent, DebtorsAgeAnalysisReportComponent, AgnentBrokerStatementReportComponent, CommissionEarnedStatemnetComponent, IntermediaryStatementForClientComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgZorroAntdModule,
        PdfViewerModule,
        RouterModule.forChild(routes),
    ],
})
export class ReportsModule {}
