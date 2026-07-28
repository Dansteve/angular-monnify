import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMonnifyComponent } from './angular-monnify.component';
import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE, MONNIFY_LIVE_SDK_URL } from './monnify-keys';

describe('AngularMonnifyComponent', () => {
  let component: AngularMonnifyComponent;
  let fixture: ComponentFixture<AngularMonnifyComponent>;
  let service: AngularMonnifyService;
  let initialize: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // The component is standalone, so it goes in `imports`, not `declarations`.
      imports: [AngularMonnifyComponent],
      providers: [
        AngularMonnifyService,
        { provide: API_KEY, useValue: 'API_KEY' },
        { provide: CONTRACT_CODE, useValue: 'CONTRACT_CODE' },
        { provide: IS_TEST_MODE, useValue: true },
      ],
    }).compileComponents();

    service = TestBed.inject(AngularMonnifyService);
    // Never hit the network from a unit test.
    spyOn(service, 'loadScript').and.resolveTo();
    initialize = jasmine.createSpy('initialize');
    (window as { MonnifySDK?: unknown }).MonnifySDK = { initialize };

    fixture = TestBed.createComponent(AngularMonnifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (window as { MonnifySDK?: unknown }).MonnifySDK;
  });

  function fillRequired(): void {
    component.customerEmail = 'someuser@email.com';
    component.customerFullName = 'John Doe';
    component.customerMobileNumber = '08121281921';
    component.amount = 50000;
    component.reference = 'ref-1';
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button that projects its content', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should require an onComplete listener', async () => {
    fillRequired();
    const error = await component.pay();
    expect(error).toContain('onComplete');
    expect(initialize).not.toHaveBeenCalled();
  });

  it('should not load the modal when the amount is not provided', async () => {
    spyOn(component.paymentInit, 'emit');
    component.onComplete.subscribe(() => undefined);
    component.customerEmail = 'someuser@email.com';
    component.customerFullName = 'John Doe';
    component.customerMobileNumber = '08121281921';

    const error = await component.pay();

    expect(error).toEqual('ANGULAR-Monnify: Monnify amount cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
    expect(initialize).not.toHaveBeenCalled();
  });

  it('should not load the modal when the email is not provided', async () => {
    spyOn(component.paymentInit, 'emit');
    component.onComplete.subscribe(() => undefined);
    component.amount = 50000;

    const error = await component.pay();

    expect(error).toEqual('ANGULAR-Monnify: Monnify email cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
  });

  it('should not load the modal when no apiKey is available anywhere', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [AngularMonnifyComponent] }).compileComponents();
    const bare = TestBed.createComponent(AngularMonnifyComponent).componentInstance;
    bare.onComplete.subscribe(() => undefined);
    bare.amount = 50000;

    expect(await bare.pay()).toEqual('ANGULAR-Monnify: Monnify apiKey cannot be empty');
  });

  it('should prefer the apiKey set on the component over the injected one', async () => {
    component.onComplete.subscribe(() => undefined);
    component.apiKey = 'componentApiKey';
    component.contractCode = 'componentContract';
    fillRequired();

    await component.pay();

    expect(component._MonnifyOptions.apiKey).toEqual('componentApiKey');
    expect(component._MonnifyOptions.contractCode).toEqual('componentContract');
  });

  it('should fall back to the injected apiKey and contractCode', async () => {
    component.onComplete.subscribe(() => undefined);
    fillRequired();

    const error = await component.pay();

    expect(error).toBeUndefined();
    expect(component._MonnifyOptions.apiKey).toEqual('API_KEY');
    expect(component._MonnifyOptions.contractCode).toEqual('CONTRACT_CODE');
  });

  it('should not load with an incomplete monnifyOptions object', async () => {
    spyOn(component.paymentInit, 'emit');
    component.onComplete.subscribe(() => undefined);
    component.monnifyOptions = {
      customerEmail: 'someuser@email.com',
      customerMobileNumber: '08121281921',
      customerFullName: 'John Doe',
      apiKey: 'apiKey',
      contractCode: 'contractCode',
      amount: 50000,
      currency: 'NGN',
      reference: '',
    };

    const error = await component.pay();

    expect(error).toEqual('ANGULAR-Monnify: Monnify reference cannot be empty');
    expect(component.paymentInit.emit).not.toHaveBeenCalled();
  });

  it('should accept a complete monnifyOptions object', async () => {
    spyOn(component.paymentInit, 'emit');
    component.onComplete.subscribe(() => undefined);
    component.paymentInit.subscribe(() => undefined);
    component.monnifyOptions = {
      customerEmail: 'someuser@email.com',
      customerMobileNumber: '08121281921',
      customerFullName: 'John Doe',
      apiKey: 'apiKey',
      contractCode: 'contractCode',
      amount: 50000,
      currency: 'NGN',
      reference: 'ref-1',
    };

    const error = await component.pay();

    expect(error).toBeUndefined();
    expect(component.paymentInit.emit).toHaveBeenCalled();
    expect(initialize).toHaveBeenCalledWith(component._MonnifyOptions);
  });

  it('should load the sandbox sdk when the component sets isTestMode', async () => {
    component.onComplete.subscribe(() => undefined);
    fillRequired();
    component.isTestMode = false;

    await component.pay();

    // isTestMode from the component (false) wins over the injected `true`.
    expect(service.loadScript).toHaveBeenCalledWith(false);
  });

  it('should pass the resolved isTestMode through to loadScript', async () => {
    component.onComplete.subscribe(() => undefined);
    fillRequired();

    await component.pay();

    expect(service.loadScript).toHaveBeenCalledWith(true);
  });

  it('should re-open checkout after the modal is closed', async () => {
    // Regression: v1 set `isPaying = true` and never reset it, so the second
    // and every later click silently did nothing.
    component.onComplete.subscribe(() => undefined);
    fillRequired();

    expect(await component.pay()).toBeUndefined();
    expect(initialize).toHaveBeenCalledTimes(1);

    // While the modal is open a second call is a no-op...
    await component.pay();
    expect(initialize).toHaveBeenCalledTimes(1);

    // ...but once the user closes it, paying again works.
    component._MonnifyOptions.onClose?.({});
    expect(await component.pay()).toBeUndefined();
    expect(initialize).toHaveBeenCalledTimes(2);
  });

  it('should emit onClose and onComplete through to the outputs', async () => {
    const completed: unknown[] = [];
    const closed: unknown[] = [];
    component.onComplete.subscribe((r) => completed.push(r));
    component.onClose.subscribe((r) => closed.push(r));
    fillRequired();

    await component.pay();

    component._MonnifyOptions.onComplete?.({ paymentStatus: 'PAID' });
    component._MonnifyOptions.onClose?.({ paymentStatus: 'FAILED' });

    expect(completed).toEqual([{ paymentStatus: 'PAID' }]);
    expect(closed).toEqual([{ paymentStatus: 'FAILED' }]);
  });

  it('should default to the production sdk url via the service', () => {
    expect(service.getScriptUrl(false)).toBe(MONNIFY_LIVE_SDK_URL);
  });
});
