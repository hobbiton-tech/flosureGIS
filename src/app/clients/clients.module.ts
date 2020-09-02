import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { Routes, RouterModule } from '@angular/router';
import { ClientsListComponent } from './components/clients-list/clients-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { ClientsService } from './services/clients.service';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';

const routes: Routes = [
    {
        path: 'create-client',
        component: CreateClientComponent,
  canActivate: [AuthGuard]
    },
    {
        path: 'client-details/:id',
        component: ClientDetailsComponent,
  canActivate: [AuthGuard]
    },
    {
        path: 'clients-list',
        component: ClientsListComponent,
      canActivate: [AuthGuard],
    },
];

@NgModule({
    declarations: [
        CreateClientComponent,
        ClientsListComponent,
        ClientDetailsComponent,
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    providers: [ClientsService],
})
export class ClientsModule {}
