import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentQuotationsListComponent } from './accident-quotations-list.component';

describe('AccidentQuotationsListComponent', () => {
  let component: AccidentQuotationsListComponent;
  let fixture: ComponentFixture<AccidentQuotationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentQuotationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentQuotationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
