import { TestBed, inject } from '@angular/core/testing';

import { AngularMonnifyService } from './angular-monnify.service';
import { API_KEY, CONTRACT_CODE, IS_TEST_MODE } from './monnify-keys';

describe('AngularMonnifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AngularMonnifyService,
        { provide: API_KEY, useValue: 'API_KEY' },
        { provide: CONTRACT_CODE, useValue: 'CONTRACT_CODE' },
        { provide: IS_TEST_MODE, useValue: 'IS_TEST_MODE' }
      ]
    });
  });

  it('should be created', inject([AngularMonnifyService], (service: AngularMonnifyService) => {
    expect(service).toBeTruthy();
  }));

  it('should inject mids', inject([AngularMonnifyService], (service: any) => {
    expect(service.mid).toEqual('apiKey');
  }));
});
