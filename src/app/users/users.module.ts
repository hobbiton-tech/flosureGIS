import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [UsersComponent],
    imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule]
})
export class UsersModule {}
