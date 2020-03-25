import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderwritingComponent } from './underwriting.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { EndorsementsComponent } from './components/endorsements/endorsements.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';

const routes: Routes = [
    {
        path: 'endorsements',
        component: EndorsementsComponent
    },
    {
        path: 'policies',
        component: PoliciesComponent
    },
    {
        path: 'policy-details',
        component: PolicyDetailsComponent
    }
];

@NgModule({
    declarations: [
        UnderwritingComponent,
        EndorsementsComponent,
        PoliciesComponent,
        PolicyDetailsComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
        PdfViewerModule
    ]
})
export class UnderWritingModule {}
