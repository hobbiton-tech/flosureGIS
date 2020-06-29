import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesComponent } from './clauses.component';

describe('ClausesComponent', () => {
  let component: ClausesComponent;
  let fixture: ComponentFixture<ClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
