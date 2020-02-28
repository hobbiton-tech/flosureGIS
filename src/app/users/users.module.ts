import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
    declarations: [UsersComponent],
    imports: [CommonModule, NgZorroAntdModule]
})
export class UsersModule {}
