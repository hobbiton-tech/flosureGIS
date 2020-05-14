import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyRenewalsDetailsComponent } from './policy-renewals-details.component';

describe('PolicyRenewalsDetailsComponent', () => {
  let component: PolicyRenewalsDetailsComponent;
  let fixture: ComponentFixture<PolicyRenewalsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyRenewalsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyRenewalsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
