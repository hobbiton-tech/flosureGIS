import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectClientComponent } from './direct-client.component';

describe('DirectClientComponent', () => {
  let component: DirectClientComponent;
  let fixture: ComponentFixture<DirectClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
