import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirePolicyScheduleComponent } from './fire-policy-schedule.component';

describe('FirePolicyScheduleComponent', () => {
  let component: FirePolicyScheduleComponent;
  let fixture: ComponentFixture<FirePolicyScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirePolicyScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirePolicyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
