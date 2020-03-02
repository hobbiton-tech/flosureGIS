import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderwritingComponent } from './underwriting.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { EndorsementsComponent } from './components/endorsements/endorsements.component';
import { PoliciesComponent } from './components/policies/policies.component';


const routes: Routes = [
    {
        path: 'endorsements',
        component: EndorsementsComponent,
    },
    {
        path: 'policies',
        component: PoliciesComponent
    }
];

@NgModule({
    declarations: [
        UnderwritingComponent,
        EndorsementsComponent,
        PoliciesComponent
    ],
    imports: [CommonModule, NgZorroAntdModule, RouterModule.forChild(routes)]
})
export class UnderWritingModule{}
