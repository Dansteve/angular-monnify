import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AngularMonnifyDirective } from './angular-monnify.directive';
import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE } from './monnify-keys';

@Component({
  standalone: true,
  imports: [AngularMonnifyDirective],
  template: `<button
    type="button"
    class="btn btn-danger m-3"
    angular-Monnify
    [customerFullName]="'John Doe'"
    [customerMobileNumber]="'08121281921'"
    [paymentDescription]="'Test Pay'"
    [customerEmail]="'mailexample@mail.com'"
    [amount]="5000"
    [apiKey]="'some-random-str'"
    [contractCode]="'some-random-str'"
    [reference]="'some-random-str'"
    (paymentInit)="paymentInit()"
    (onClose)="paymentCancel()"
    (onComplete)="paymentDone($event)"
  >
    Pay
  </button>`,
})
class TestHostComponent {
  @ViewChild(AngularMonnifyDirective) directive!: AngularMonnifyDirective;
  events: string[] = [];

  paymentInit(): void {
    this.events.push('init');
  }

  paymentDone(_ref: unknown): void {
    this.events.push('complete');
  }

  paymentCancel(): void {
    this.events.push('close');
  }
}

describe('AngularMonnifyDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let payButton: DebugElement;
  let service: AngularMonnifyService;
  let initialize: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        AngularMonnifyService,
        { provide: API_KEY, useValue: 'API_KEY' },
        { provide: CONTRACT_CODE, useValue: 'CONTRACT_CODE' },
        { provide: IS_TEST_MODE, useValue: true },
      ],
    }).compileComponents();

    service = TestBed.inject(AngularMonnifyService);
    spyOn(service, 'loadScript').and.resolveTo();
    initialize = jasmine.createSpy('initialize');
    (window as { MonnifySDK?: unknown }).MonnifySDK = { initialize };

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    payButton = fixture.debugElement.query(By.css('button'));
  });

  afterEach(() => {
    delete (window as { MonnifySDK?: unknown }).MonnifySDK;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.directive).toBeTruthy();
  });

  it('should keep the native class attribute on the host', () => {
    // v1 declared `class` as an @Input on the directive, which swallowed the
    // host's class binding. The directive never used it.
    expect(payButton.nativeElement.className).toContain('btn-danger');
  });

  it('should open checkout when the host element is clicked', async () => {
    payButton.triggerEventHandler('click', {});
    await fixture.whenStable();

    expect(service.loadScript).toHaveBeenCalled();
    expect(initialize).toHaveBeenCalled();
    expect(component.events).toContain('init');
  });

  it('should emit onComplete and onClose', async () => {
    await component.directive.pay();

    component.directive._MonnifyOptions.onComplete?.({ paymentStatus: 'PAID' });
    component.directive._MonnifyOptions.onClose?.({});

    expect(component.events).toEqual(['init', 'complete', 'close']);
  });

  it('should build options from the template bindings', async () => {
    await component.directive.pay();

    expect(component.directive._MonnifyOptions.apiKey).toBe('some-random-str');
    expect(component.directive._MonnifyOptions.amount).toBe(5000);
    expect(component.directive._MonnifyOptions.currency).toBe('NGN');
    expect(component.directive._MonnifyOptions.customerEmail).toBe('mailexample@mail.com');
  });
});
