import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { DashboardService } from './services/dashboard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, NgZorroAntdModule, RouterModule.forChild(routes),ReactiveFormsModule,FormsModule,],
    providers: [DashboardService],
    exports: [DashboardComponent]
})
export class DashboardModule {}
