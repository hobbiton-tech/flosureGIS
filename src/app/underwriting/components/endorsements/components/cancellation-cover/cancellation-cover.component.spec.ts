import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationCoverComponent } from './cancellation-cover.component';

describe('CancellationCoverComponent', () => {
  let component: CancellationCoverComponent;
  let fixture: ComponentFixture<CancellationCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
