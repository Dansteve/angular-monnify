import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AngularMonnifyDirective } from './angular-monnify.directive';
import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE } from './monnify-keys';
import { TestComponent } from './TestComponent';

describe('AngularMonnifyDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let payButton: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularMonnifyDirective, TestComponent ],
      providers: [
        AngularMonnifyService,
        { provide: API_KEY, useValue: 'API_KEY' },
        { provide: CONTRACT_CODE, useValue: 'CONTRACT_CODE' },
        { provide: IS_TEST_MODE, useValue: 'IS_TEST_MODE' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    payButton = fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should make payment', () => {
  //   spyOn(component, "paymentInit")
  //   expect(component).toBeTruthy();
  //   payButton.triggerEventHandler("click", {})
  //   fixture.detectChanges();

  //   expect(component.paymentInit).toHaveBeenCalled()
  // });
});
