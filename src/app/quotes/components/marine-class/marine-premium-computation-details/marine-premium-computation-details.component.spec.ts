import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarinePremiumComputationDetailsComponent } from './marine-premium-computation-details.component';

describe('MarinePremiumComputationDetailsComponent', () => {
  let component: MarinePremiumComputationDetailsComponent;
  let fixture: ComponentFixture<MarinePremiumComputationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarinePremiumComputationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarinePremiumComputationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
