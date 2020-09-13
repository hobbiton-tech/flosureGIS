import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireQuotationsListComponent } from './fire-quotations-list.component';

describe('FireQuotationsListComponent', () => {
  let component: FireQuotationsListComponent;
  let fixture: ComponentFixture<FireQuotationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireQuotationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireQuotationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
