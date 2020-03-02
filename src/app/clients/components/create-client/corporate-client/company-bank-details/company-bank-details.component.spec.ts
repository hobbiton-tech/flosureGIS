import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBankDetailsComponent } from './company-bank-details.component';

describe('CompanyBankDetailsComponent', () => {
  let component: CompanyBankDetailsComponent;
  let fixture: ComponentFixture<CompanyBankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
