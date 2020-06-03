import { IS_TEST_MODE } from './monnify-keys';
import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MonnifyOptions, PrivateMonnifyOptions, MonnifySplitOptions } from '../model/monnify-options';
import { AngularMonnifyService } from './angular-monnify.service';

interface MyWindow extends Window {
  MonnifySDK: {
    initialize(options: Partial<MonnifyOptions>)
  };
}
declare var window: MyWindow;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[angular-Monnify]',
})
export class AngularMonnifyDirective {
  @Input() apiKey: string;
  @Input() isTestMode: boolean;
  @Input() contractCode: string;
  @Input() amount: number;
  @Input() metadata: any;
  @Input() reference: string;
  @Input() currency: string;
  @Input() customerFullName: string;
  @Input() customerEmail: string;
  @Input() customerMobileNumber: string;
  @Input() paymentDescription: string;
  @Input() incomeSplitConfig: MonnifySplitOptions[];
  @Input() redirectUrl: string;
  @Input() monnifyOptions: MonnifyOptions;
  @Input() class: string;
  @Input() style: object;
  @Output() paymentInit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>(); // tslint:disable-line
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();
  private _MonnifyOptions: Partial<PrivateMonnifyOptions>; // tslint:disable-line
  private isPaying = false;

  constructor(private MonnifyService: AngularMonnifyService) { }

  async pay() {
    let errorText = '';
    if (this.monnifyOptions && Object.keys(this.monnifyOptions).length >= 2) {
      errorText = this.validateInput(this.monnifyOptions);
      this.generateOptions(this.monnifyOptions);
    } else {
      errorText = this.validateInput(this);
      this.generateOptions(this);
    }
    if (errorText) {
      console.error(errorText);
      return errorText;
    }
    await this.MonnifyService.loadScript();
    // if (this.isPaying) { return; }
    if (this.paymentInit.observers.length) {
      this.paymentInit.emit();
    }
    // console.log(window);
    // console.log(this._MonnifyOptions);
    const payment = window.MonnifySDK.initialize(this._MonnifyOptions);
    // payment.loadIframe(this._MonnifyOptions);
    // this.isPaying = false;
  }

  validateInput(obj: MonnifyOptions) {
    if (!this.onComplete.observers.length) {
      return 'ANGULAR-Monnify: Insert a onComplete output like so (onComplete)=\'PaymentComplete($event)\' to check payment status';
    }
    return this.MonnifyService.checkInput(obj);
  }

  generateOptions(obj: MonnifyOptions) {
    this._MonnifyOptions = this.MonnifyService.getMonnifyOptions(obj);
    this._MonnifyOptions.onClose = (...response) => {
      if (this.onClose.observers.length) {
        this.onClose.emit(...response);
      }
    };
    this._MonnifyOptions.onComplete = (...response) => {
      this.onComplete.emit(...response);
    };
  }

  @HostListener('click')
  async buttonClick() {
    this.pay();
  }
}
