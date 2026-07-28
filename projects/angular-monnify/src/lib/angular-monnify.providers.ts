import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE } from './monnify-keys';

/**
 * Standalone equivalent of `AngularMonnifyModule.forRoot()`.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideAngularMonnify('apiKey', 'contractCode', false)],
 * });
 * ```
 *
 * @param apiKey Merchant's API key from the Monnify dashboard.
 * @param contractCode Merchant's contract code from the Monnify dashboard.
 * @param isTestMode `true` loads the sandbox SDK, `false` (default) loads the
 *   live production SDK.
 */
export function provideAngularMonnify(
  apiKey: string,
  contractCode: string,
  isTestMode: boolean = false,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    AngularMonnifyService,
    { provide: API_KEY, useValue: apiKey },
    { provide: CONTRACT_CODE, useValue: contractCode },
    { provide: IS_TEST_MODE, useValue: isTestMode },
  ]);
}
