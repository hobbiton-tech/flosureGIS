import { PolicyScheduleCombinedDocumentComponent } from './documents/policy-schedule-combined-document/policy-schedule-combined-document.component';
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
import { PolicyRenewalsComponent } from './components/policy-renewals/policy-renewals.component';
import { PolicyRenewalsDetailsComponent } from './components/policy-renewals-details/policy-renewals-details.component';
import { RevisionCoverComponent } from './components/endorsements/components/revision-cover/revision-cover.component';
import { ExtensionCoverComponent } from './components/endorsements/components/extension-cover/extension-cover.component';
import { CancellationCoverComponent } from './components/endorsements/components/cancellation-cover/cancellation-cover.component';
import { ViewEndorsementsComponent } from './components/endorsements/components/view-endorsements/view-endorsements.component';
// import { EndorsementResolver } from './resolvers/endorsement.resolver';
import { EndorsementService } from './services/endorsements.service';
import { EditPolicyComponent } from './components/endorsements/components/edit-policy/edit-policy.component';
import { EditExtensionComponent } from './components/endorsements/components/edit-extension/edit-extension.component';
import { EditCancellationComponent } from './components/endorsements/components/edit-cancellation/edit-cancellation.component';
// tslint:disable-next-line: max-line-length
import { PolicyCancellationDetailsComponent } from './components/endorsements/policy-cancellation-details/policy-cancellation-details.component';
import { PolicyExtensionDetailsComponent } from './components/endorsements/policy-extension-details/policy-extension-details.component';
import { PolicyRevisionDetailsComponent } from './components/endorsements/policy-revision-details/policy-revision-details.component';
// import { ViewRiskComponent } from './components/endorsements/policy-revision-details/view-risk/view-risk.component';
import { AddRiskComponent } from './components/endorsements/policy-revision-details/add-risk/add-risk.component';
// tslint:disable-next-line: max-line-length
import { ViewExtensionRiskComponent } from './components/endorsements/policy-extension-details/view-extension-risk/view-extension-risk.component';
// tslint:disable-next-line: max-line-length
import { ViewCancellationRiskComponent } from './components/endorsements/policy-cancellation-details/view-cancellation-risk/view-cancellation-risk.component';
import { BackupPolicyDetailsComponent } from './components/endorsements/backup-policy-details/backup-policy-details.component';
// tslint:disable-next-line: max-line-length
import { ViewBackupPolicyRisksComponent } from './components/endorsements/backup-policy-details/view-backup-policy-risks/view-backup-policy-risks.component';
import { PolicyCreditNoteDocumentComponent } from './documents/policy-credit-note-document/policy-credit-note-document.component';
import { IntermediaryDetailsComponent } from './components/endorsements/intermediary-details/intermediary-details.component';
import { PolicyWordingComponent } from './documents/policy-wording/policy-wording.component';
import { PolicyComprehensiveCertificateComponent } from './documents/policy-comprehensive-certificate/policy-comprehensive-certificate';
import { PolicyThirdpartyCertificateComponent } from './documents/policy-thirdparty-certificate/policy-thirdparty-certificate.component';
import { QuotesModule } from '../quotes/quotes.module';
import { FirePolicyScheduleComponent } from './documents/Fire-insurance/fire-policy-schedule/fire-policy-schedule.component';
import { FireCoverNoteComponent } from './documents/Fire-insurance/fire-cover-note/fire-cover-note.component';
import { CreateQuoteComponent } from '../quotes/components/create-quote/create-quote.component';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';
import { PersonalAccidentScheduleComponent } from './documents/Accident-insurance/personal-accident-schedule/personal-accident-schedule.component';
import { BondScheduleComponent } from './documents/Accident-insurance/bond-schedule/bond-schedule.component';
import { PolicyHistoryComponent } from './components/policy-history/policy-history.component';
import { PolicyEndorsementDetailsComponent } from './components/policy-endorsement-details/policy-endorsement-details.component';
import { EngineeringPolicyScheduleComponent } from './documents/Engineering-insurance/engineering-policy-schedule/engineering-policy-schedule.component';
import { MarinePolicyScheduleComponent } from './documents/Marine-insurance/marine-policy-schedule/marine-policy-schedule.component';
import { MarineCoverNoteComponent } from './documents/Marine-insurance/marine-cover-note/marine-cover-note.component';
// tslint:disable-next-line: max-line-length

const routes: Routes = [
    {
        path: 'endorsements',
        component: EndorsementsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'endorsements/revision-cover',
        component: RevisionCoverComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'endorsements/view-endorsements',
        component: ViewEndorsementsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'endorsements/extension-cover',
        component: ExtensionCoverComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'endorsements/cancellation-cover',
        component: CancellationCoverComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'endorsements/edit-policy',
        component: EditPolicyComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'endorsements/edit-cancellation',
        component: EditCancellationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'endorsements/edit-extension',
        component: EditExtensionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policies',
        component: PoliciesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policy-details',
        component: PolicyDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policy-history/:id',
        component: PolicyHistoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policy-endorsement-details/:id',
        component: PolicyEndorsementDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policy-revision-details/:id',
        component: PolicyRevisionDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policy-extension-details/:id',
        component: PolicyExtensionDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policy-cancellation-details/:id',
        component: PolicyCancellationDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'backup-policy-details/:id',
        component: BackupPolicyDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'policy-details/:id',
        component: PolicyDetailsComponent,
        resolve: PolicyDetailsResolver
    },
    {
        path: 'policy-renewal-list',
        component: PolicyRenewalsComponent
    },
    {
        path: 'policy-renewal-details/:id',
        component: PolicyRenewalsDetailsComponent
    },
    {
        path: 'intermediary-view/:id',
        component: IntermediaryDetailsComponent
    },
    {
        path: 'policy-wording/:id',
        component: PolicyWordingComponent
    }
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
        RevisionCoverComponent,
        ExtensionCoverComponent,
        CancellationCoverComponent,
        ViewEndorsementsComponent,
        EditPolicyComponent,
        EditExtensionComponent,
        EditCancellationComponent,
        PolicyCancellationDetailsComponent,
        PolicyExtensionDetailsComponent,
        PolicyRevisionDetailsComponent,
        // ViewRiskComponent,
        AddRiskComponent,
        ViewExtensionRiskComponent,
        ViewCancellationRiskComponent,
        BackupPolicyDetailsComponent,
        ViewBackupPolicyRisksComponent,
        PolicyCreditNoteDocumentComponent,
        IntermediaryDetailsComponent,
        PolicyWordingComponent,
        PolicyComprehensiveCertificateComponent,
        PolicyThirdpartyCertificateComponent,
        PolicyScheduleCombinedDocumentComponent,
        FirePolicyScheduleComponent,
        FireCoverNoteComponent,
        PersonalAccidentScheduleComponent,
        BondScheduleComponent,
        PolicyHistoryComponent,
        PolicyEndorsementDetailsComponent,
        EngineeringPolicyScheduleComponent,
        MarinePolicyScheduleComponent,
        MarineCoverNoteComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        PdfViewerModule,
        NgxPrintModule,
        QuotesModule
    ],
    providers: [
        PolicyDetailsResolver,
        PoliciesService,
        EndorsementService,
        CreateQuoteComponent
    ]
})
export class UnderWritingModule {}
