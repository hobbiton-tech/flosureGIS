import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientStatementsComponent } from './client-statements.component';

describe('ClientStatementsComponent', () => {
  let component: ClientStatementsComponent;
  let fixture: ComponentFixture<ClientStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
