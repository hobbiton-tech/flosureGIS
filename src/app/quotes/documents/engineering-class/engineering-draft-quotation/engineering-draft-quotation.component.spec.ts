import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringDraftQuotationComponent } from './engineering-draft-quotation.component';

describe('EngineeringDraftQuotationComponent', () => {
  let component: EngineeringDraftQuotationComponent;
  let fixture: ComponentFixture<EngineeringDraftQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringDraftQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringDraftQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
