import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvageReceiptComponent } from './salvage-receipt.component';

describe('SalvageReceiptComponent', () => {
  let component: SalvageReceiptComponent;
  let fixture: ComponentFixture<SalvageReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalvageReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvageReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
