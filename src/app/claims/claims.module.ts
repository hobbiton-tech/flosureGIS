import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsComponent } from './claims.component';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IntimateClaimComponent } from './components/intimate-claim/intimate-claim.component';
import { ClaimTransactionsComponent } from './components/claim-transactions/claim-transactions.component';
import { ClaimantsComponent } from './components/claimants/claimants.component';

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
      path: 'claimants',
      component: ClaimantsComponent
  }
]



@NgModule({
  declarations: [ClaimsComponent, IntimateClaimComponent, ClaimTransactionsComponent, ClaimantsComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes)
  ]
})
export class ClaimsModule { }
