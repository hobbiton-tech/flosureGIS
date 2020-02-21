import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { QuotesComponent } from './quotes/quotes.component';
import { QuotesModule } from './quotes/quotes.module';
import { ClientsComponent } from './clients/clients.component';
import { ClientsModule } from './clients/clients.module';
import { CreateQuoteComponent } from './quotes/components/create-quote/create-quote.component';

const routes: Routes = [
    {
        path: '',
        component: NavigationComponent,
        children: [
            {
                path: '',
                component: QuotesComponent
            },
            {
                path: 'clients',
                component: ClientsComponent
            },
            {
                path: 'create-quote',
                component: CreateQuoteComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes), QuotesModule, ClientsModule],
    exports: [RouterModule]
})
export class AppRoutingModule {}
