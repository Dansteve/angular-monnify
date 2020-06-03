import { InjectionToken } from '@angular/core';

export const API_KEY = new InjectionToken<string>('monnify.apiKey');
export const CONTRACT_CODE = new InjectionToken<string>('monnify.contractCode');
export const IS_TEST_MODE = new InjectionToken<string>('monnify.isTestMode');
