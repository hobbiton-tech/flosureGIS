import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossAdjustorComponent } from './loss-adjustor.component';

describe('LossAdjustorComponent', () => {
  let component: LossAdjustorComponent;
  let fixture: ComponentFixture<LossAdjustorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossAdjustorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossAdjustorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
