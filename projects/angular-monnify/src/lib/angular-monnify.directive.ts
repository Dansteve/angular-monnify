import { Directive, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { MonnifyOptions, MonnifySplitOptions, PrivateMonnifyOptions } from '../model/monnify-options';
import { AngularMonnifyService } from './angular-monnify.service';

interface MonnifyWindow extends Window {
  MonnifySDK?: {
    initialize(options: Partial<MonnifyOptions>): void;
  };
}

declare const window: MonnifyWindow;

/**
 * Opens the Monnify checkout when the host element is clicked.
 *
 * Standalone as of v2 — import it directly into a standalone component, or keep
 * using `AngularMonnifyModule`.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[angular-Monnify]',
  standalone: true,
})
export class AngularMonnifyDirective {
  @Input() apiKey?: string;
  @Input() isTestMode?: boolean;
  @Input() contractCode?: string;
  @Input() amount?: number;
  @Input() metadata?: object;
  @Input() reference?: string;
  @Input() currency?: string;
  @Input() customerFullName?: string;
  @Input() customerEmail?: string;
  @Input() customerMobileNumber?: string;
  @Input() paymentDescription?: string;
  @Input() incomeSplitConfig?: MonnifySplitOptions[];
  @Input() redirectUrl?: string;
  @Input() monnifyOptions?: Partial<MonnifyOptions>;

  @Output() paymentInit = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClose = new EventEmitter<unknown>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onComplete = new EventEmitter<unknown>();

  /** The options last handed to the Monnify SDK. Exposed for debugging/tests. */
  public _MonnifyOptions: Partial<PrivateMonnifyOptions> = {};

  private readonly monnifyService = inject(AngularMonnifyService);
  private isPaying = false;

  /**
   * Validate the inputs and open the Monnify checkout.
   *
   * @returns the validation error message, or `undefined` once checkout opened.
   */
  async pay(): Promise<string | undefined> {
    if (this.isPaying) {
      return undefined;
    }

    const source: Partial<MonnifyOptions> =
      this.monnifyOptions && Object.keys(this.monnifyOptions).length >= 2 ? this.monnifyOptions : this;

    const errorText = this.validateInput(source);
    this.generateOptions(source);

    if (errorText) {
      console.error(errorText);
      return errorText;
    }

    await this.monnifyService.loadScript(this._MonnifyOptions.isTestMode);

    if (!window.MonnifySDK || typeof window.MonnifySDK.initialize !== 'function') {
      const message = 'ANGULAR-Monnify: the Monnify SDK loaded but did not expose MonnifySDK.initialize';
      console.error(message);
      return message;
    }

    this.isPaying = true;
    if (this.paymentInit.observed) {
      this.paymentInit.emit();
    }
    window.MonnifySDK.initialize(this._MonnifyOptions);
    return undefined;
  }

  validateInput(obj: Partial<MonnifyOptions>): string {
    if (!this.onComplete.observed) {
      return 'ANGULAR-Monnify: Insert a onComplete output like so (onComplete)=\'PaymentComplete($event)\' to check payment status';
    }
    return this.monnifyService.checkInput(obj);
  }

  generateOptions(obj: Partial<MonnifyOptions>): void {
    this._MonnifyOptions = this.monnifyService.getMonnifyOptions(obj);
    this._MonnifyOptions.onClose = (response?: unknown) => {
      this.isPaying = false;
      if (this.onClose.observed) {
        this.onClose.emit(response);
      }
    };
    this._MonnifyOptions.onComplete = (response?: unknown) => {
      this.isPaying = false;
      this.onComplete.emit(response);
    };
  }

  @HostListener('click')
  buttonClick(): void {
    void this.pay();
  }
}
