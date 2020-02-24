import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { OrganizationalSetupsComponent } from './components/organizational-setups/organizational-setups.component';
import { UnderwritingSetupsComponent } from './components/underwriting-setups/underwriting-setups.component';



@NgModule({
  declarations: [SettingsComponent, OrganizationalSetupsComponent, UnderwritingSetupsComponent],
  imports: [
    CommonModule
  ],
  exports: [SettingsComponent]
})
export class SettingsModule { }
