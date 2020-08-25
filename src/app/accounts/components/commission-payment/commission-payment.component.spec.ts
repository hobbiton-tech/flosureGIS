import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionPaymentComponent } from './commission-payment.component';

describe('CommissionPaymentComponent', () => {
  let component: CommissionPaymentComponent;
  let fixture: ComponentFixture<CommissionPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
