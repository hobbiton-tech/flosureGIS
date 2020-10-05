import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineCoverNoteComponent } from './marine-cover-note.component';

describe('MarineCoverNoteComponent', () => {
  let component: MarineCoverNoteComponent;
  let fixture: ComponentFixture<MarineCoverNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarineCoverNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineCoverNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
