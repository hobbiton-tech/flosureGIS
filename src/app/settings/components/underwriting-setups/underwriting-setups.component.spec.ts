import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderwritingSetupsComponent } from './underwriting-setups.component';

describe('UnderwritingSetupsComponent', () => {
  let component: UnderwritingSetupsComponent;
  let fixture: ComponentFixture<UnderwritingSetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnderwritingSetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderwritingSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
