import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringScheduleDetailsComponent } from './engineering-schedule-details.component';

describe('EngineeringScheduleDetailsComponent', () => {
  let component: EngineeringScheduleDetailsComponent;
  let fixture: ComponentFixture<EngineeringScheduleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringScheduleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
