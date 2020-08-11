import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IntimateClaimComponent } from './components/intimate-claim/intimate-claim.component';
import { ClaimTransactionsComponent } from './components/claim-transactions/claim-transactions.component';
import { ClaimDetailsComponent } from './components/claim-details/claim-details.component';
import { ClaimsService } from './services/claims-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerilsComponent } from './components/perils/perils.component';
import { AddPerilsComponent } from './components/perils/components/add-perils/add-perils.component';

const routes: Routes = [
    {
        path: 'intimate-claims',
        component: IntimateClaimComponent,
    },
    {
        path: 'claim-transactions',
        component: ClaimTransactionsComponent,
    },
    {
        path: 'claim-details',
        component: ClaimDetailsComponent,
    },
    {
        path: 'claim-details/:id',
        component: ClaimDetailsComponent,
    },
];

@NgModule({
    declarations: [
        IntimateClaimComponent,
        ClaimTransactionsComponent,
        ClaimDetailsComponent,
        PerilsComponent,
        AddPerilsComponent,
    ],
    providers: [ClaimsService],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
})
export class ClaimsModule {}
