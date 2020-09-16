import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequisitionVoucherComponent } from './payment-requisition-voucher.component';

describe('PaymentRequisitionVoucherComponent', () => {
  let component: PaymentRequisitionVoucherComponent;
  let fixture: ComponentFixture<PaymentRequisitionVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRequisitionVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRequisitionVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
