import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentDraftQuotationComponent } from './accident-draft-quotation.component';

describe('AccidentDraftQuotationComponent', () => {
  let component: AccidentDraftQuotationComponent;
  let fixture: ComponentFixture<AccidentDraftQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentDraftQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentDraftQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
