import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BondScheduleComponent } from './bond-schedule.component';

describe('BondScheduleComponent', () => {
  let component: BondScheduleComponent;
  let fixture: ComponentFixture<BondScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BondScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BondScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
