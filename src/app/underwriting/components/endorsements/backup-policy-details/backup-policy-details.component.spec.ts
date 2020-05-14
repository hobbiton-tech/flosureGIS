import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupPolicyDetailsComponent } from './backup-policy-details.component';

describe('BackupPolicyDetailsComponent', () => {
  let component: BackupPolicyDetailsComponent;
  let fixture: ComponentFixture<BackupPolicyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupPolicyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupPolicyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
