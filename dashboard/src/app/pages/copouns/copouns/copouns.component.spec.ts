import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopounsComponent } from './copouns.component';

describe('CopounsComponent', () => {
  let component: CopounsComponent;
  let fixture: ComponentFixture<CopounsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopounsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopounsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
