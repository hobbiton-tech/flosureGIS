import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionPaymentComponent } from './requisition-payment.component';

describe('RequisitionPaymentComponent', () => {
  let component: RequisitionPaymentComponent;
  let fixture: ComponentFixture<RequisitionPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
