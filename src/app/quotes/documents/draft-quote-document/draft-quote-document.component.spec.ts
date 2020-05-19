import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftQuoteDocumentComponent } from './draft-quote-document.component';

describe('DraftQuoteDocumentComponent', () => {
  let component: DraftQuoteDocumentComponent;
  let fixture: ComponentFixture<DraftQuoteDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftQuoteDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftQuoteDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
