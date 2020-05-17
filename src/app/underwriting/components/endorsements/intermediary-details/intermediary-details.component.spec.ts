import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediaryDetailsComponent } from './intermediary-details.component';

describe('IntermediaryDetailsComponent', () => {
  let component: IntermediaryDetailsComponent;
  let fixture: ComponentFixture<IntermediaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
