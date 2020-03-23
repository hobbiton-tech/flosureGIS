import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { DashboardService } from './services/dashboard.service';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, NgZorroAntdModule, RouterModule.forChild(routes)],
    providers: [DashboardService],
    exports: [DashboardComponent]
})
export class DashboardModule {}
