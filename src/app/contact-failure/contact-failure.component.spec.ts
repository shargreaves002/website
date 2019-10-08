import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFailureComponent } from './contact-failure.component';

describe('ContactFailureComponent', () => {
  let component: ContactFailureComponent;
  let fixture: ComponentFixture<ContactFailureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactFailureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
