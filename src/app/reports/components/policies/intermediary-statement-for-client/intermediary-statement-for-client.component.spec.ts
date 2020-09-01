import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediaryStatementForClientComponent } from './intermediary-statement-for-client.component';

describe('IntermediaryStatementForClientComponent', () => {
  let component: IntermediaryStatementForClientComponent;
  let fixture: ComponentFixture<IntermediaryStatementForClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediaryStatementForClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediaryStatementForClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
