import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
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
import { ProcessedClaimsComponent } from './components/processed-claims/processed-claims.component';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';
import { AddThirdPartyDetailsComponent } from './components/add-third-party-details/add-third-party-details.component';
import { SalvagesComponent } from './components/salvages/salvages.component';
import { SalvageInvoiceComponent } from './components/salvage-invoice/salvage-invoice.component';
import { SubrogationsComponent } from './components/subrogations/subrogations.component';
import { SubrogateInvoiceComponent } from './components/subrogate-invoice/subrogate-invoice.component';
import {
  NzBadgeModule,
  NzBreadCrumbModule, NzButtonModule,
  NzCardModule, NzDescriptionsModule, NzDividerModule, NzDrawerModule,
  NzFormModule, NzGridModule, NzIconModule,
  NzInputModule, NzMessageModule,
  NzModalModule,
  NzPageHeaderModule,
  NzSelectModule,
  NzSpinModule, NzStatisticModule, NzTableModule, NzTagModule,
  NzUploadModule
} from 'ng-zorro-antd';

const routes: Routes = [
    {
        path: 'intimate-claims',
        component: IntimateClaimComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'claim-transactions',
        component: ClaimTransactionsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'claimants',
        component: ClaimantsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'claim-details',
        component: ClaimDetailsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'claim-details/:id',
        component: ClaimDetailsComponent,
        resolve: {
            claim: CalimsResolverService
        },
      canActivate: [AuthGuard]
    },
    {
        path: 'claim-approval',
        component: ClaimApprovalComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'claims-processing',
        component: ClaimsProcessingComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'claims-processing/processed-claims',
        component: ProcessedClaimsComponent,
        canActivate: [AuthGuard]
    },
    {
      path: 'salvages',
      component: SalvagesComponent,
      canActivate: [AuthGuard]
    },
  {
    path: 'salvage-invoices',
    component: SalvageInvoiceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subrogation',
    component: SubrogationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subrogation-invoice',
    component: SubrogateInvoiceComponent,
    canActivate: [AuthGuard]
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
        AddClaimantModalComponent,
        ProcessedClaimsComponent,
        AddThirdPartyDetailsComponent,
        SalvagesComponent,
        SalvageInvoiceComponent,
        SubrogationsComponent,
        SubrogateInvoiceComponent
    ],
    providers: [ClaimsService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzListModule,
    NzModalModule,
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzUploadModule,
    NzPageHeaderModule,
    NzCardModule,
    NzTableModule,
    NzDescriptionsModule,
    NzTagModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzStatisticModule,
    NzBadgeModule,
    NzDividerModule,
    NzIconModule,
    NzDrawerModule,
    NzMessageModule,
    NzButtonModule
  ]
})
export class ClaimsModule {}
