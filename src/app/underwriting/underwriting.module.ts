import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderwritingComponent } from './underwriting.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
    declarations: [UnderwritingComponent, PoliciesComponent],
    imports: [CommonModule, NgZorroAntdModule],
    exports: [PoliciesComponent]
})
export class UnderwritingModule {}
