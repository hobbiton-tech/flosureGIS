import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRequisitionsComponent } from './approved-requisitions.component';

describe('ApprovedRequisitionsComponent', () => {
  let component: ApprovedRequisitionsComponent;
  let fixture: ComponentFixture<ApprovedRequisitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedRequisitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
