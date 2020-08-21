import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumComputationDetailsComponent } from './premium-computation-details.component';

describe('PremiumComputationDetailsComponent', () => {
  let component: PremiumComputationDetailsComponent;
  let fixture: ComponentFixture<PremiumComputationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumComputationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumComputationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
