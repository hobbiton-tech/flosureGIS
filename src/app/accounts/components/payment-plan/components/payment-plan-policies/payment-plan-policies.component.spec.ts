import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanPoliciesComponent } from './payment-plan-policies.component';

describe('PaymentPlanPoliciesComponent', () => {
  let component: PaymentPlanPoliciesComponent;
  let fixture: ComponentFixture<PaymentPlanPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPlanPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
