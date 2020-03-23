import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { SettingsComponent } from './settings/settings.component';
import { OrganizationalSetupsComponent } from './settings/components/organizational-setups/organizational-setups.component';
import { LoginComponent } from './login/login.component';

import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'flosure',
        component: NavigationComponent,
        children: [
            {
                path: 'dashboard',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(
                        m => m.DashboardModule
                    )
            },
            {
                path: 'clients',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./clients/clients.module').then(
                        m => m.ClientsModule
                    )
            },
            {
                path: 'settings',
                // canActivate: [AngularFireAuthGuard],
                component: SettingsComponent
            },
            {
                path: 'organizational-setups',
                // canActivate: [AngularFireAuthGuard],
                component: OrganizationalSetupsComponent
            },
            {
                path: 'underwriting',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./underwriting/underwriting.module').then(
                        m => m.UnderWritingModule
                    )
            },
            {
                path: 'quotes',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./quotes/quotes.module').then(m => m.QuotesModule)
            },
            {
                path: 'claims',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./claims/claims.module').then(m => m.ClaimsModule)
            },
            {
                path: 'accounts',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./accounts/accounts.module').then(
                        m => m.AccountsModule
                    )
            },
            {
                path: 'reports',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./reports/reports.module').then(
                        m => m.ReportsModule
                    )
            },
            {
                path: 'user-management',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'settings',
                // canActivate: [AngularFireAuthGuard],
                loadChildren: () =>
                    import('./settings/settings.module').then(
                        m => m.SettingsModule
                    )
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
