import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopounModifyComponent } from './copoun-modify.component';

describe('CopounModifyComponent', () => {
  let component: CopounModifyComponent;
  let fixture: ComponentFixture<CopounModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopounModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopounModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
