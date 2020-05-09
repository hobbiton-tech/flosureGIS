import { NgModule, Component } from '@angular/core';
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
import { RevisionCoverComponent } from './components/endorsements/components/revision-cover/revision-cover.component';
import { ExtensionCoverComponent } from './components/endorsements/components/extension-cover/extension-cover.component';
import { CancellationCoverComponent } from './components/endorsements/components/cancellation-cover/cancellation-cover.component';
import { ViewEndorsementsComponent } from './components/endorsements/components/view-endorsements/view-endorsements.component';
// import { EndorsementResolver } from './resolvers/endorsement.resolver';
import { EndorsementService } from './services/endorsements.service';
import { EditPolicyComponent } from './components/endorsements/components/edit-policy/edit-policy.component';
import { EditExtensionComponent } from './components/endorsements/components/edit-extension/edit-extension.component';
import { EditCancellationComponent } from './components/endorsements/components/edit-cancellation/edit-cancellation.component';

const routes: Routes = [
    {
        path: 'endorsements',
        component: EndorsementsComponent,
    },
    {
        path: 'endorsements/revision-cover',
        component: RevisionCoverComponent,
    },
    {
        path: 'endorsements/view-endorsements',
        component: ViewEndorsementsComponent,
    },
    {
        path: 'endorsements/extension-cover',
        component: ExtensionCoverComponent,
    },
    {
        path: 'endorsements/cancellation-cover',
        component: CancellationCoverComponent,
    },
    {
        path: 'endorsements/edit-policy',
        component: EditPolicyComponent,
    },
    {
        path:'endorsements/edit-cancellation',
        component: EditCancellationComponent,
    },
    {
        path:'endorsements/edit-extension',
        component: EditExtensionComponent,
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
        RevisionCoverComponent,
        ExtensionCoverComponent,
        CancellationCoverComponent,
        ViewEndorsementsComponent,
        EditPolicyComponent,
        EditExtensionComponent,
        EditCancellationComponent,
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
    providers: [PolicyDetailsResolver, PoliciesService, EndorsementService],
})
export class UnderWritingModule {}
