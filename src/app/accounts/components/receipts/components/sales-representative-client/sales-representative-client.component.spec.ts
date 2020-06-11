import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRepresentativeClientComponent } from './sales-representative-client.component';

describe('SalesRepresentativeClientComponent', () => {
  let component: SalesRepresentativeClientComponent;
  let fixture: ComponentFixture<SalesRepresentativeClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesRepresentativeClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesRepresentativeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
