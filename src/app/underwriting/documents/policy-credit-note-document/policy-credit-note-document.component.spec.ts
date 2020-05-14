import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCreditNoteDocumentComponent } from './policy-credit-note-document.component';

describe('PolicyCreditNoteDocumentComponent', () => {
  let component: PolicyCreditNoteDocumentComponent;
  let fixture: ComponentFixture<PolicyCreditNoteDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyCreditNoteDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyCreditNoteDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
