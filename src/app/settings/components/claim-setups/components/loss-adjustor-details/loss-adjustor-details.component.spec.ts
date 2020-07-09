import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossAdjustorDetailsComponent } from './loss-adjustor-details.component';

describe('LossAdjustorDetailsComponent', () => {
  let component: LossAdjustorDetailsComponent;
  let fixture: ComponentFixture<LossAdjustorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossAdjustorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossAdjustorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
