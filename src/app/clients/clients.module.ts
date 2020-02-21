import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateClientComponent } from './components/create-client/create-client.component';

@NgModule({
    declarations: [ClientsComponent, CreateClientComponent],
    imports: [CommonModule, NgZorroAntdModule],
    exports: [ClientsComponent]
})
export class ClientsModule {}
