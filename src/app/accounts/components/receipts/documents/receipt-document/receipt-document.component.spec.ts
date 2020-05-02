import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDocumentComponent } from './receipt-document.component';

describe('ReceiptDocumentComponent', () => {
  let component: ReceiptDocumentComponent;
  let fixture: ComponentFixture<ReceiptDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
