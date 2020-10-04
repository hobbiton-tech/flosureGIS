import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringPremiumComputationDetailsComponent } from './engineering-premium-computation-details.component';

describe('EngineeringPremiumComputationDetailsComponent', () => {
  let component: EngineeringPremiumComputationDetailsComponent;
  let fixture: ComponentFixture<EngineeringPremiumComputationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringPremiumComputationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringPremiumComputationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
