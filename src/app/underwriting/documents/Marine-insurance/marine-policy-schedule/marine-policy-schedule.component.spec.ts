import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarinePolicyScheduleComponent } from './marine-policy-schedule.component';

describe('MarinePolicyScheduleComponent', () => {
  let component: MarinePolicyScheduleComponent;
  let fixture: ComponentFixture<MarinePolicyScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarinePolicyScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarinePolicyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
