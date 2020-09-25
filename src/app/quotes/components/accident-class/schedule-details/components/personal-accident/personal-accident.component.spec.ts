import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccidentComponent } from './personal-accident.component';

describe('PersonalAccidentComponent', () => {
  let component: PersonalAccidentComponent;
  let fixture: ComponentFixture<PersonalAccidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalAccidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
