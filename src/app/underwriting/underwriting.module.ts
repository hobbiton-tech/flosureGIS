import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesComponent } from './components/policies/policies.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { EndorsementsComponent } from './components/endorsements/endorsements.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PolicyCertificateDocumentComponent } from './documents/policy-certificate-document/policy-certificate-document.component';
import { PolicyClausesDocumentComponent } from './documents/policy-clauses-document/policy-clauses-document.component';
import { PolicyScheduleDocumentComponent } from './documents/policy-schedule-document/policy-schedule-document.component';
import { PolicyDebitNoteDocumentComponent } from './documents/policy-debit-note-document/policy-debit-note-document.component';
import { PolicyDetailsResolver } from './resolvers/policy-details.resolver';
import { PoliciesService } from './services/policies.service';
import { PolicyRenewalsComponent } from './components/policy-renewals/policy-renewals.component';
import { PolicyRenewalsDetailsComponent } from './components/policy-renewals-details/policy-renewals-details.component';

const routes: Routes = [
    {
        path: 'endorsements',
        component: EndorsementsComponent,
    },
    {
        path: 'policies',
        component: PoliciesComponent,
    },
    {
        path: 'policy-details',
        component: PolicyDetailsComponent,
    },
    {
        path: 'policy-details/:id',
        component: PolicyDetailsComponent,
        resolve: PolicyDetailsResolver,
    },
    {
        path: 'policy-renewal-list',
        component: PolicyRenewalsComponent,
    },
    {
        path: 'policy-renewal-details/:id',
        component: PolicyRenewalsDetailsComponent,
    },
];

@NgModule({
    declarations: [
        EndorsementsComponent,
        PoliciesComponent,
        PolicyDetailsComponent,
        PolicyCertificateDocumentComponent,
        PolicyClausesDocumentComponent,
        PolicyScheduleDocumentComponent,
        PolicyDebitNoteDocumentComponent,
        PolicyRenewalsComponent,
        PolicyRenewalsDetailsComponent,
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        PdfViewerModule,
        NgxPrintModule,
    ],
    providers: [PolicyDetailsResolver, PoliciesService],
})
export class UnderWritingModule {}
