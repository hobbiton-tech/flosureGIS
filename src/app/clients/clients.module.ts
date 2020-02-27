import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { Routes, RouterModule } from '@angular/router';
import { ClientsListComponent } from './components/clients-list/clients-list.component';


const routes: Routes = [
    {
        path: 'create-client',
        component: CreateClientComponent
    },
    {
        path: 'clients-list',
        component: ClientsListComponent
    }
]

@NgModule({
    declarations: [ClientsComponent, CreateClientComponent, ClientsListComponent],
    imports: [CommonModule, NgZorroAntdModule, RouterModule.forChild(routes)],
    exports: [ClientsComponent]
})
export class ClientsModule {}
