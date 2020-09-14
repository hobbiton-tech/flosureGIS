import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirePremiumComputationDetailsComponent } from './fire-premium-computation-details.component';

describe('FirePremiumComputationDetailsComponent', () => {
  let component: FirePremiumComputationDetailsComponent;
  let fixture: ComponentFixture<FirePremiumComputationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirePremiumComputationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirePremiumComputationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
