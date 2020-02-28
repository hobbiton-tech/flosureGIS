import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalSetupsComponent } from './organizational-setups.component';

describe('OrganizationalSetupsComponent', () => {
  let component: OrganizationalSetupsComponent;
  let fixture: ComponentFixture<OrganizationalSetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationalSetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
