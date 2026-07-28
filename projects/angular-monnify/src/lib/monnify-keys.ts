import { InjectionToken } from '@angular/core';

/**
 * Merchant's API Key (found on the Monnify dashboard).
 *
 * Has a root-level default of `''` so `AngularMonnifyService` can be injected
 * without `AngularMonnifyModule.forRoot()` / `provideAngularMonnify()`. In that
 * case the key must be supplied per payment on the component/directive.
 */
export const API_KEY = new InjectionToken<string>('monnify.apiKey', {
  providedIn: 'root',
  factory: () => '',
});

/**
 * Merchant's contract code (found on the Monnify dashboard).
 */
export const CONTRACT_CODE = new InjectionToken<string>('monnify.contractCode', {
  providedIn: 'root',
  factory: () => '',
});

/**
 * When `true` the sandbox SDK is loaded, otherwise the live production SDK is
 * used. Defaults to `false` so an unconfigured app never silently transacts
 * against the sandbox.
 */
export const IS_TEST_MODE = new InjectionToken<boolean>('monnify.isTestMode', {
  providedIn: 'root',
  factory: () => false,
});

/** URL of the live (production) Monnify web SDK. */
export const MONNIFY_LIVE_SDK_URL = 'https://sdk.monnify.com/plugin/monnify.js';

/** URL of the sandbox (test) Monnify web SDK. */
export const MONNIFY_SANDBOX_SDK_URL = 'https://sandbox.sdk.monnify.com/plugin/monnify.js';
