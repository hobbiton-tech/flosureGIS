import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderwritingComponent } from './underwriting.component';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

const routes: Routes = [
  {
      path: 'endorsments',
  },
  {
      path: 'policies',
  }
]

@NgModule({
  declarations: [UnderwritingComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
     RouterModule.forChild(routes)
  ]
})
export class UnderwritingModule { }
