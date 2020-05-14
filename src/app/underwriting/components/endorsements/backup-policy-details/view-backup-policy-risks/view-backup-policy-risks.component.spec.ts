import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBackupPolicyRisksComponent } from './view-backup-policy-risks.component';

describe('ViewBackupPolicyRisksComponent', () => {
  let component: ViewBackupPolicyRisksComponent;
  let fixture: ComponentFixture<ViewBackupPolicyRisksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBackupPolicyRisksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBackupPolicyRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
