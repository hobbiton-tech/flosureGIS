import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineDraftQuotationComponent } from './marine-draft-quotation.component';

describe('MarineDraftQuotationComponent', () => {
  let component: MarineDraftQuotationComponent;
  let fixture: ComponentFixture<MarineDraftQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarineDraftQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineDraftQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
