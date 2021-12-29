import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMonnifyComponent } from './angular-monnify.component';
import { AngularMonnifyDirective } from './angular-monnify.directive';
import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, IS_TEST_MODE, CONTRACT_CODE } from './monnify-keys';

@NgModule({
  imports: [CommonModule],
  exports: [AngularMonnifyComponent, AngularMonnifyDirective],
  declarations: [AngularMonnifyComponent, AngularMonnifyDirective],
  providers: [],
})
export class AngularMonnifyModule {
  // tslint:disable-next-line:variable-name
  static forRoot(apiKey: string, contractCode: string, isTestMode: boolean = false): ModuleWithProviders<any> {
    return {
      ngModule: AngularMonnifyModule,
      providers: [
        AngularMonnifyService,
        { provide: API_KEY, useValue: apiKey },
        { provide: IS_TEST_MODE, useValue: isTestMode },
        { provide: CONTRACT_CODE, useValue: contractCode }
      ]
    };
  }
}
