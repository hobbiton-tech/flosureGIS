import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IntimateClaimComponent } from './components/intimate-claim/intimate-claim.component';
import { ClaimTransactionsComponent } from './components/claim-transactions/claim-transactions.component';
import { ClaimantsComponent } from './components/claimants/claimants.component';
import { ClaimDetailsComponent } from './components/claim-details/claim-details.component';
import { ClaimsService } from './services/claims-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerilsComponent } from './components/perils/perils.component';
import { AddPerilsComponent } from './components/perils/components/add-perils/add-perils.component';
import { ClaimApprovalComponent } from './components/claim-approval/claim-approval.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { PhotoUploadComponent } from './components/photo-upload/photo-upload.component';
import { ServiceProviderQuotationsComponent } from './components/service-provider-quotations/service-provider-quotations.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { ClaimsProcessingComponent } from './components/claims-processing/claims-processing.component';
import { DocmentUploadModalComponent } from './components/docment-upload-modal/docment-upload-modal.component';
import { PhotoUploadModalComponent } from './components/photo-upload-modal/photo-upload-modal.component';
import { AddServiceProviderQuoteComponent } from './components/add-service-provider-quote/add-service-provider-quote.component';
import { LossQuantumModalComponent } from './components/loss-quantum-modal/loss-quantum-modal.component';
import { CalimsResolverService } from './services/calims-resolver.service';
import { ClaimApprovalModalComponent } from './components/claim-approval-modal/claim-approval-modal.component';
import { AddClaimantModalComponent } from './components/add-claimant-modal/add-claimant-modal.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

const routes: Routes = [
    {
        path: 'intimate-claims',
        component: IntimateClaimComponent
    },
    {
        path: 'claim-transactions',
        component: ClaimTransactionsComponent
    },
    {
        path: 'claimants',
        component: ClaimantsComponent
    },
    {
        path: 'claim-details',
        component: ClaimDetailsComponent
    },
    {
        path: 'claim-details/:id',
        component: ClaimDetailsComponent,
        resolve: {
            claim: CalimsResolverService
        }
    },
    {
        path: 'claim-approval',
        component: ClaimApprovalComponent
    },
    {
        path: 'claims-processing',
        component: ClaimsProcessingComponent
    }
];

@NgModule({
    declarations: [
        IntimateClaimComponent,
        ClaimTransactionsComponent,
        ClaimantsComponent,
        ClaimDetailsComponent,
        PerilsComponent,
        AddPerilsComponent,
        ClaimApprovalComponent,
        DocumentUploadComponent,
        PhotoUploadComponent,
        ServiceProviderQuotationsComponent,
        ClaimsProcessingComponent,
        DocmentUploadModalComponent,
        PhotoUploadModalComponent,
        AddServiceProviderQuoteComponent,
        LossQuantumModalComponent,
        ClaimApprovalModalComponent,
        AddClaimantModalComponent
    ],
    providers: [ClaimsService],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        FormsModule,
        RouterModule.forChild(routes),
        NzListModule,
        NzBadgeModule
    ]
})
export class ClaimsModule {}
