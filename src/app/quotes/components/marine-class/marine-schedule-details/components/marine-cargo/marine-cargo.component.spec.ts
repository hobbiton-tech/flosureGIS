import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineCargoComponent } from './marine-cargo.component';

describe('MarineCargoComponent', () => {
  let component: MarineCargoComponent;
  let fixture: ComponentFixture<MarineCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarineCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
