import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionEarnedStatemnetComponent } from './commission-earned-statemnet.component';

describe('CommissionEarnedStatemnetComponent', () => {
  let component: CommissionEarnedStatemnetComponent;
  let fixture: ComponentFixture<CommissionEarnedStatemnetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionEarnedStatemnetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionEarnedStatemnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
