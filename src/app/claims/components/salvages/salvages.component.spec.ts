import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvagesComponent } from './salvages.component';

describe('SalvagesComponent', () => {
  let component: SalvagesComponent;
  let fixture: ComponentFixture<SalvagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalvagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
