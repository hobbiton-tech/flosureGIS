import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyRenewalsComponent } from './policy-renewals.component';

describe('PolicyRenewalsComponent', () => {
  let component: PolicyRenewalsComponent;
  let fixture: ComponentFixture<PolicyRenewalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
