import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineQuotationsListComponent } from './marine-quotations-list.component';

describe('MarineQuotationsListComponent', () => {
  let component: MarineQuotationsListComponent;
  let fixture: ComponentFixture<MarineQuotationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarineQuotationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineQuotationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
