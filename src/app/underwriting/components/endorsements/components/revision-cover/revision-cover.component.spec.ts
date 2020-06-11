import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionCoverComponent } from './revision-cover.component';

describe('RevisionCoverComponent', () => {
  let component: RevisionCoverComponent;
  let fixture: ComponentFixture<RevisionCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
