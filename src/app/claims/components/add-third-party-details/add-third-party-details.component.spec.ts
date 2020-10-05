import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThirdPartyDetailsComponent } from './add-third-party-details.component';

describe('AddThirdPartyDetailsComponent', () => {
  let component: AddThirdPartyDetailsComponent;
  let fixture: ComponentFixture<AddThirdPartyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddThirdPartyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThirdPartyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
