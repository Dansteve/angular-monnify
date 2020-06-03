import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMonnifyComponent } from './angular-monnify.component';
import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE } from './monnify-keys';

describe('AngularMonnifyComponent', () => {
  let component: AngularMonnifyComponent;
  let fixture: ComponentFixture<AngularMonnifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AngularMonnifyComponent],
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
    fixture = TestBed.createComponent(AngularMonnifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load the modal when the amount is not provided', async () => {
    spyOn(component.paymentInit, 'emit');
    component.customerEmail = 'someuser@email.com';
    component.apiKey = 'apiKey';
    component.contractCode = 'contractCode';
    component.onComplete.subscribe(() => { });
    const error = await component.pay();

    fixture.detectChanges();
    expect(error).toEqual('ANGULAR-Monnify: Monnify amount cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
  });

  it('should not load the modal when the email is not provided', async () => {
    spyOn(component.paymentInit, 'emit');
    component.apiKey = 'apiKey';
    component.contractCode = 'contractCode';
    component.amount = 50000;
    component.onComplete.subscribe(() => { });
    const error = await component.pay();

    fixture.detectChanges();
    expect(error).toEqual('ANGULAR-Monnify: Monnify email cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
  });

  it('should not load the modal when apiKey is not provided', async () => {
    spyOn(component.paymentInit, 'emit');
    component.customerEmail = 'someuser@email.com';
    component.contractCode = 'contractCode';
    component.amount = 50000;
    component.onComplete.subscribe(() => { });
    const error = await component.pay();

    fixture.detectChanges();
    expect(error).toEqual('ANGULAR-Monnify: Monnify apiKey cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
  });

  it('should prefer apiKey used by component', async () => {
    spyOn(component.paymentInit, 'emit');
    component.customerEmail = 'someuser@email.com';
    component.amount = 50000;
    component.apiKey = 'apiKey';
    component.contractCode = 'contractCode';
    component.onComplete.subscribe(() => { });
    const error = await component.pay();

    fixture.detectChanges();
    expect(error).toEqual('ANGULAR-Monnify: Monnify ref cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
    expect(component._MonnifyOptions.apiKey).toEqual(component.apiKey);
  });

  it('should not load with incomplete MonnifyOptions object', async () => {
    spyOn(component.paymentInit, 'emit');
    component.monnifyOptions = {
      customerEmail: 'someuser@email.com',
      customerMobileNumber : '',
      apiKey: 'apiKey',
      amount: 50000,
      currency: '',
      reference: '',
      contractCode: 'contractCode',
      customerFullName: ''
    };
    component.onComplete.subscribe(() => { });
    component.paymentInit.subscribe(() => { });
    const error = await component.pay();

    fixture.detectChanges();
    expect(error).toEqual('ANGULAR-Monnify: Monnify ref cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
  });

  it('should accept the MonnifyOptions object', async () => {
    spyOn(component.paymentInit, 'emit');
    component.monnifyOptions = {
      customerEmail: 'someuser@email.com',
      customerMobileNumber : '',
      apiKey: 'apiKey',
      amount: 50000,
      currency: '',
      reference: '',
      contractCode: 'contractCode',
      customerFullName: ''
    };
    component.onComplete.subscribe(() => { });
    component.paymentInit.subscribe(() => { });
    const error = await component.pay();

    fixture.detectChanges();
    expect(error).toBeUndefined();
    expect(component.paymentInit.emit).toHaveBeenCalled();
  });

  it('should load the modal when parameters are passed', async () => {
    spyOn(component.paymentInit, 'emit');
    component.customerEmail = 'someuser@email.com';
    component.apiKey = 'apiKey';
    component.amount = 50000;
    component.onComplete.subscribe(() => { });
    component.paymentInit.subscribe(() => { });
    const error = await component.pay();

    fixture.detectChanges();
    expect(error).toBeUndefined();
    expect(component.paymentInit.emit).toHaveBeenCalled();
  });
});
