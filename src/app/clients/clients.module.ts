import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
    declarations: [ClientsComponent],
    imports: [CommonModule, NgZorroAntdModule],
    exports: [ClientsComponent]
})
export class ClientsModule {}
