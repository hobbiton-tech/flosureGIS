import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectClientStatementComponent } from './direct-client-statement.component';

describe('DirectClientStatementComponent', () => {
  let component: DirectClientStatementComponent;
  let fixture: ComponentFixture<DirectClientStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectClientStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectClientStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
