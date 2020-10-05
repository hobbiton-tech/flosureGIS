import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvageInvoiceComponent } from './salvage-invoice.component';

describe('SalvageInvoiceComponent', () => {
  let component: SalvageInvoiceComponent;
  let fixture: ComponentFixture<SalvageInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalvageInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvageInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
