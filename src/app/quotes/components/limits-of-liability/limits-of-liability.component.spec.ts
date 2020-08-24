import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitsOfLiabilityComponent } from './limits-of-liability.component';

describe('LimitsOfLiabilityComponent', () => {
  let component: LimitsOfLiabilityComponent;
  let fixture: ComponentFixture<LimitsOfLiabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitsOfLiabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitsOfLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
