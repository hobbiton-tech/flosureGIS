import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentModeComponent } from './create-payment-mode.component';

describe('CreatePaymentModeComponent', () => {
  let component: CreatePaymentModeComponent;
  let fixture: ComponentFixture<CreatePaymentModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePaymentModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
