import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableModifyComponent } from './variable-modify.component';

describe('VariableModifyComponent', () => {
  let component: VariableModifyComponent;
  let fixture: ComponentFixture<VariableModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
