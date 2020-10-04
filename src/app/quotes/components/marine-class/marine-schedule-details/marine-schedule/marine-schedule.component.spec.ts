import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineScheduleComponent } from './marine-schedule.component';

describe('MarineScheduleComponent', () => {
  let component: MarineScheduleComponent;
  let fixture: ComponentFixture<MarineScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarineScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
