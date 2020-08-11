import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanReceiptComponent } from './plan-receipt.component';

describe('PlanReceiptComponent', () => {
  let component: PlanReceiptComponent;
  let fixture: ComponentFixture<PlanReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
