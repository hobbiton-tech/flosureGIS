import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeAnalysisComponent } from './age-analysis.component';

describe('AgeAnalysisComponent', () => {
  let component: AgeAnalysisComponent;
  let fixture: ComponentFixture<AgeAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
