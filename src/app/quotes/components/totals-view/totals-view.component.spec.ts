import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsViewComponent } from './totals-view.component';

describe('TotalsViewComponent', () => {
  let component: TotalsViewComponent;
  let fixture: ComponentFixture<TotalsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
