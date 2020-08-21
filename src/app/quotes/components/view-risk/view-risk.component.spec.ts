import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRiskComponent } from './view-risk.component';

describe('ViewRiskComponent', () => {
  let component: ViewRiskComponent;
  let fixture: ComponentFixture<ViewRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
