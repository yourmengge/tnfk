import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpzjComponent } from './cpzj.component';

describe('CpzjComponent', () => {
  let component: CpzjComponent;
  let fixture: ComponentFixture<CpzjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpzjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpzjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
