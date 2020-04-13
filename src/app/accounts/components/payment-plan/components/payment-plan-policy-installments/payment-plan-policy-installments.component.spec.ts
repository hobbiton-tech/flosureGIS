import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanPolicyInstallmentsComponent } from './payment-plan-policy-installments.component';

describe('PaymentPlanPolicyInstallmentsComponent', () => {
  let component: PaymentPlanPolicyInstallmentsComponent;
  let fixture: ComponentFixture<PaymentPlanPolicyInstallmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPlanPolicyInstallmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanPolicyInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
