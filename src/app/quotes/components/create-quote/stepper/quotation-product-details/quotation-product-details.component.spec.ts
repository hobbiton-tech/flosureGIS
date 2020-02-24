import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationProductDetailsComponent } from './quotation-product-details.component';

describe('QuotationProductDetailsComponent', () => {
  let component: QuotationProductDetailsComponent;
  let fixture: ComponentFixture<QuotationProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
