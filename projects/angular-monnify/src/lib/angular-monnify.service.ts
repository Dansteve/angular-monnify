import { Injectable, inject } from '@angular/core';
import {
  API_KEY,
  CONTRACT_CODE,
  IS_TEST_MODE,
  MONNIFY_LIVE_SDK_URL,
  MONNIFY_SANDBOX_SDK_URL,
} from './monnify-keys';
import { MonnifyOptions } from '../model/monnify-options';

interface MonnifyWindow extends Window {
  MonnifySDK?: {
    initialize(options: Partial<MonnifyOptions>): void;
  };
}

declare const window: MonnifyWindow;

@Injectable({
  providedIn: 'root',
})
export class AngularMonnifyService {
  private readonly apiKey = inject(API_KEY);
  private readonly contractCode = inject(CONTRACT_CODE);
  private readonly isTestMode = inject(IS_TEST_MODE);

  /**
   * Resolve the Monnify web SDK URL for the given mode.
   *
   * `true` -> sandbox SDK, `false` -> live production SDK.
   */
  getScriptUrl(test: boolean = this.isTestMode): string {
    return test ? MONNIFY_SANDBOX_SDK_URL : MONNIFY_LIVE_SDK_URL;
  }

  /**
   * Append the Monnify web SDK `<script>` to the document, resolving once it
   * has loaded. A no-op when the SDK is already on the page.
   */
  loadScript(test: boolean = this.isTestMode): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (window.MonnifySDK && typeof window.MonnifySDK.initialize === 'function') {
        resolve();
        return;
      }
      const src = this.getScriptUrl(test);
      const script = window.document.createElement('script');
      script.setAttribute('src', src);
      const onLoad = () => {
        script.removeEventListener('load', onLoad);
        resolve();
      };
      const onError = () => {
        script.removeEventListener('error', onError);
        reject(new Error(`ANGULAR-Monnify: failed to load the Monnify SDK from ${src}`));
      };
      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
      window.document.head.appendChild(script);
    });
  }

  checkInput(obj: Partial<MonnifyOptions>): string {
    if (!obj.apiKey && !this.apiKey) {
      return 'ANGULAR-Monnify: Monnify apiKey cannot be empty';
    }
    if (!obj.contractCode && !this.contractCode) {
      return 'ANGULAR-Monnify: Monnify contractCode cannot be empty';
    }
    if (!obj.customerEmail) {
      return 'ANGULAR-Monnify: Monnify email cannot be empty';
    }
    if (!obj.customerFullName) {
      return 'ANGULAR-Monnify: Monnify name cannot be empty';
    }
    if (!obj.customerMobileNumber) {
      return 'ANGULAR-Monnify: Monnify phone cannot be empty';
    }
    if (!obj.amount) {
      return 'ANGULAR-Monnify: Monnify amount cannot be empty';
    }
    if (!obj.reference) {
      return 'ANGULAR-Monnify: Monnify reference cannot be empty';
    }
    return '';
  }

  getMonnifyOptions(obj: Partial<MonnifyOptions>): Partial<MonnifyOptions> {
    const monnifyOptions: Partial<MonnifyOptions> = {
      isTestMode: obj.isTestMode ?? this.isTestMode,
      apiKey: obj.apiKey || this.apiKey,
      contractCode: obj.contractCode || this.contractCode,
      amount: obj.amount,
      reference: obj.reference,
      currency: obj.currency || 'NGN',
      customerFullName: obj.customerFullName || '',
      customerEmail: obj.customerEmail || '',
      customerMobileNumber: obj.customerMobileNumber || '',
      paymentDescription: obj.paymentDescription || '',
      redirectUrl: obj.redirectUrl || '',
      metadata: obj.metadata || {},
      incomeSplitConfig: obj.incomeSplitConfig,
    };
    return this.clean(monnifyOptions);
  }

  clean<T extends object>(obj: T): T {
    for (const propName of Object.keys(obj)) {
      const value = (obj as Record<string, unknown>)[propName];
      if (value === null || value === undefined) {
        delete (obj as Record<string, unknown>)[propName];
      }
    }
    return obj;
  }
}
