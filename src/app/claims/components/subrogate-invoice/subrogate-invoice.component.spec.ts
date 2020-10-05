import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrogateInvoiceComponent } from './subrogate-invoice.component';

describe('SubrogateInvoiceComponent', () => {
  let component: SubrogateInvoiceComponent;
  let fixture: ComponentFixture<SubrogateInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubrogateInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubrogateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
