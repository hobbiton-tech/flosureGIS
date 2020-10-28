import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringQuotationsListComponent } from './engineering-quotations-list.component';

describe('EngineeringQuotationsListComponent', () => {
  let component: EngineeringQuotationsListComponent;
  let fixture: ComponentFixture<EngineeringQuotationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringQuotationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringQuotationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
