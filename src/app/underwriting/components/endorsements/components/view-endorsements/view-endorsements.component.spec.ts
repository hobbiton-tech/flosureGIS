import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEndorsementsComponent } from './view-endorsements.component';

describe('ViewEndorsementsComponent', () => {
  let component: ViewEndorsementsComponent;
  let fixture: ComponentFixture<ViewEndorsementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEndorsementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEndorsementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
