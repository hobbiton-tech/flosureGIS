import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumComputationComponent } from './premium-computation.component';

describe('PremiumComputationComponent', () => {
  let component: PremiumComputationComponent;
  let fixture: ComponentFixture<PremiumComputationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumComputationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumComputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
