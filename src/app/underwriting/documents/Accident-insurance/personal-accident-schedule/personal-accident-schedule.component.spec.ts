import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccidentScheduleComponent } from './personal-accident-schedule.component';

describe('PersonalAccidentScheduleComponent', () => {
  let component: PersonalAccidentScheduleComponent;
  let fixture: ComponentFixture<PersonalAccidentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalAccidentScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAccidentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
