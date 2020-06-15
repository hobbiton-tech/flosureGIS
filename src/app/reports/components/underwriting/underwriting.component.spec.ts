import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderwritingComponent } from './underwriting.component';

describe('UnderwritingComponent', () => {
  let component: UnderwritingComponent;
  let fixture: ComponentFixture<UnderwritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnderwritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
