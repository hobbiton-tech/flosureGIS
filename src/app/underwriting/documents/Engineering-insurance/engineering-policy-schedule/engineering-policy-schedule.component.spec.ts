import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringPolicyScheduleComponent } from './engineering-policy-schedule.component';

describe('EngineeringPolicyScheduleComponent', () => {
  let component: EngineeringPolicyScheduleComponent;
  let fixture: ComponentFixture<EngineeringPolicyScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringPolicyScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringPolicyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
