import { ModuleWithProviders, NgModule } from '@angular/core';

import { AngularMonnifyComponent } from './angular-monnify.component';
import { AngularMonnifyDirective } from './angular-monnify.directive';
import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE } from './monnify-keys';

/**
 * NgModule wrapper around the standalone `AngularMonnifyComponent` and
 * `AngularMonnifyDirective`.
 *
 * Existing (v1) apps keep working unchanged:
 *
 * ```ts
 * imports: [AngularMonnifyModule.forRoot('apiKey', 'contractCode', false)]
 * ```
 *
 * Standalone apps should prefer `provideAngularMonnify()` and import the
 * component/directive directly.
 */
@NgModule({
  imports: [AngularMonnifyComponent, AngularMonnifyDirective],
  exports: [AngularMonnifyComponent, AngularMonnifyDirective],
})
export class AngularMonnifyModule {
  /**
   * Register the merchant credentials application-wide.
   *
   * @param apiKey Merchant's API key from the Monnify dashboard.
   * @param contractCode Merchant's contract code from the Monnify dashboard.
   * @param isTestMode `true` loads the sandbox SDK, `false` (default) loads the
   *   live production SDK.
   */
  static forRoot(
    apiKey: string,
    contractCode: string,
    isTestMode: boolean = false,
  ): ModuleWithProviders<AngularMonnifyModule> {
    return {
      ngModule: AngularMonnifyModule,
      providers: [
        AngularMonnifyService,
        { provide: API_KEY, useValue: apiKey },
        { provide: IS_TEST_MODE, useValue: isTestMode },
        { provide: CONTRACT_CODE, useValue: contractCode },
      ],
    };
  }
}
