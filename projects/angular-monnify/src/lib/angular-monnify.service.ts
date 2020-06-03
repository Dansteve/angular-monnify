import { Injectable, Inject } from '@angular/core';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE } from './monnify-keys';
import { MonnifyOptions } from '../model/monnify-options';

interface MyWindow extends Window {
  MonnifySDK: {
    initialize(options: Partial<MonnifyOptions>)
  };
}
declare var window: MyWindow;

@Injectable({
  providedIn: 'root',
})
export class AngularMonnifyService {
  // tslint:disable-next-line:ban-types
  constructor(@Inject(API_KEY) private apiKey: string,
              @Inject(CONTRACT_CODE) private contractCode: string,
              @Inject(IS_TEST_MODE) private isTestMode: boolean = false) { }

  loadScript(): Promise<void> {
    return new Promise(resolve => {
      if (window.MonnifySDK && typeof window.MonnifySDK.initialize === 'function') {
        resolve();
        return;
      }
      const script = window.document.createElement('script');
      window.document.head.appendChild(script);
      const onLoadFunc = () => {
        script.removeEventListener('load', onLoadFunc);
        resolve();
      };
      script.addEventListener('load', onLoadFunc);
      if (this.isTestMode) {
        script.setAttribute('src', 'https://sandbox.sdk.monnify.com/plugin/monnify.js');
      } else {
        script.setAttribute('src', 'https://sandbox.sdk.monnify.com/plugin/monnify.js');
      }
      console.log('loaded');
    });
  }

  checkInput(obj: Partial<MonnifyOptions>): string {
    if (!obj.apiKey && !this.apiKey) {
      return 'ANGULAR-Monnify: Please insert a your apiKey';
    }
    if (!obj.contractCode) {
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

  getMonnifyOptions(obj: MonnifyOptions): MonnifyOptions {
    const monnifyOptions: MonnifyOptions = {
      isTestMode: obj.isTestMode || this.isTestMode,
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
      incomeSplitConfig: obj.incomeSplitConfig || null
    };
    return this.clean(monnifyOptions);
  }

  clean(obj: MonnifyOptions) {
    // tslint:disable-next-line:prefer-const
    for (let propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
}
