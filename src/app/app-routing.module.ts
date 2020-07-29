import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { OrganizationalSetupsComponent } from './settings/components/organizational-setups/organizational-setups.component';
import { LoginComponent } from './login/login.component';


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
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(
                        m => m.DashboardModule
                    )
            },
            {
                path: 'clients',
                loadChildren: () =>
                    import('./clients/clients.module').then(
                        m => m.ClientsModule
                    )
            },
            {
                path: 'organizational-setups',
                component: OrganizationalSetupsComponent
            },
            {
                path: 'underwriting',
                loadChildren: () =>
                    import('./underwriting/underwriting.module').then(
                        m => m.UnderWritingModule
                    )
            },
            {
                path: 'quotes',
                loadChildren: () =>
                    import('./quotes/quotes.module').then(m => m.QuotesModule)
            },
            {
                path: 'claims',
                loadChildren: () =>
                    import('./claims/claims.module').then(m => m.ClaimsModule)
            },
            {
                path: 'accounts',
                loadChildren: () =>
                    import('./accounts/accounts.module').then(
                        m => m.AccountsModule
                    )
            },
            {
                path: 'reports',
                loadChildren: () =>
                    import('./reports/reports.module').then(
                        m => m.ReportsModule
                    )
            },
            {
                path: 'user-management',
                loadChildren: () =>
                    import('./users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./settings/settings.module').then(
                        m => m.SettingsModule
                    )
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
