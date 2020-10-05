import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrogationsComponent } from './subrogations.component';

describe('SubrogationsComponent', () => {
  let component: SubrogationsComponent;
  let fixture: ComponentFixture<SubrogationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubrogationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubrogationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
