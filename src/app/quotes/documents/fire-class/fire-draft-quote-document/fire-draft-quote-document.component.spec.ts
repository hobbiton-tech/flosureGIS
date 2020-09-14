import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireDraftQuoteDocumentComponent } from './fire-draft-quote-document.component';

describe('FireDraftQuoteDocumentComponent', () => {
  let component: FireDraftQuoteDocumentComponent;
  let fixture: ComponentFixture<FireDraftQuoteDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireDraftQuoteDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireDraftQuoteDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
