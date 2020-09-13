import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireCoverNoteComponent } from './fire-cover-note.component';

describe('FireCoverNoteComponent', () => {
  let component: FireCoverNoteComponent;
  let fixture: ComponentFixture<FireCoverNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireCoverNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireCoverNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
