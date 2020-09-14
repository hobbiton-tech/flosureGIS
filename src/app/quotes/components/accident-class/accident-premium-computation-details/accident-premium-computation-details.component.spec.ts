import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentPremiumComputationDetailsComponent } from './accident-premium-computation-details.component';

describe('AccidentPremiumComputationDetailsComponent', () => {
  let component: AccidentPremiumComputationDetailsComponent;
  let fixture: ComponentFixture<AccidentPremiumComputationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentPremiumComputationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentPremiumComputationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
