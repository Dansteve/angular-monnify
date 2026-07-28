import { TestBed } from '@angular/core/testing';

import { AngularMonnifyService } from './angular-monnify.service';
import {
  API_KEY,
  CONTRACT_CODE,
  IS_TEST_MODE,
  MONNIFY_LIVE_SDK_URL,
  MONNIFY_SANDBOX_SDK_URL,
} from './monnify-keys';

function configure(isTestMode: boolean): AngularMonnifyService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      AngularMonnifyService,
      { provide: API_KEY, useValue: 'API_KEY' },
      { provide: CONTRACT_CODE, useValue: 'CONTRACT_CODE' },
      { provide: IS_TEST_MODE, useValue: isTestMode },
    ],
  });
  return TestBed.inject(AngularMonnifyService);
}

describe('AngularMonnifyService', () => {
  it('should be created', () => {
    expect(configure(true)).toBeTruthy();
  });

  it('should be injectable without forRoot()/provideAngularMonnify()', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const service = TestBed.inject(AngularMonnifyService);
    expect(service).toBeTruthy();
    // Defaults must be safe: no credentials, and production (NOT sandbox).
    expect(service.getScriptUrl()).toBe(MONNIFY_LIVE_SDK_URL);
  });

  describe('SDK url resolution (regression: v1.3.2 always loaded sandbox)', () => {
    it('should load the SANDBOX sdk when isTestMode is true', () => {
      const url = configure(true).getScriptUrl();
      expect(url).toBe(MONNIFY_SANDBOX_SDK_URL);
      expect(url).toContain('sandbox.sdk.monnify.com');
    });

    it('should load the PRODUCTION sdk when isTestMode is false', () => {
      const url = configure(false).getScriptUrl();
      expect(url).toBe(MONNIFY_LIVE_SDK_URL);
      expect(url).toBe('https://sdk.monnify.com/plugin/monnify.js');
      expect(url).not.toContain('sandbox');
    });

    // The bug: both branches of the `if (isTestMode)` were identical, so
    // production apps silently transacted against the sandbox.
    it('should NEVER resolve the same url for test mode and production', () => {
      const testUrl = configure(true).getScriptUrl();
      const liveUrl = configure(false).getScriptUrl();
      expect(testUrl).not.toEqual(liveUrl);
    });

    it('should let an explicit argument override the injected mode', () => {
      expect(configure(true).getScriptUrl(false)).toBe(MONNIFY_LIVE_SDK_URL);
      expect(configure(false).getScriptUrl(true)).toBe(MONNIFY_SANDBOX_SDK_URL);
    });
  });

  describe('loadScript', () => {
    afterEach(() => {
      document.head.querySelectorAll('script[src*="monnify.js"]').forEach((el) => el.remove());
      delete (window as { MonnifySDK?: unknown }).MonnifySDK;
    });

    it('should append a script tag pointing at the production sdk', () => {
      const service = configure(false);
      service.loadScript().catch(() => undefined);
      const script = document.head.querySelector('script[src*="monnify.js"]');
      expect(script).toBeTruthy();
      expect(script?.getAttribute('src')).toBe(MONNIFY_LIVE_SDK_URL);
    });

    it('should append a script tag pointing at the sandbox sdk in test mode', () => {
      const service = configure(true);
      service.loadScript().catch(() => undefined);
      const script = document.head.querySelector('script[src*="monnify.js"]');
      expect(script?.getAttribute('src')).toBe(MONNIFY_SANDBOX_SDK_URL);
    });

    it('should resolve immediately and not re-append when the sdk is already present', async () => {
      const service = configure(true);
      (window as { MonnifySDK?: unknown }).MonnifySDK = { initialize: () => undefined };
      await service.loadScript();
      expect(document.head.querySelector('script[src*="monnify.js"]')).toBeNull();
    });
  });

  describe('checkInput', () => {
    it('should fall back to the injected apiKey', () => {
      expect(configure(true).checkInput({ contractCode: 'c' })).not.toContain('apiKey');
    });

    it('should fall back to the injected contractCode', () => {
      // Regression: v1 only checked obj.contractCode, so a contract code
      // supplied via forRoot() was ignored and always reported as missing.
      expect(configure(true).checkInput({ apiKey: 'k' })).not.toContain('contractCode');
    });

    it('should report a missing apiKey when neither source has one', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const service = TestBed.inject(AngularMonnifyService);
      expect(service.checkInput({})).toBe('ANGULAR-Monnify: Monnify apiKey cannot be empty');
    });

    it('should validate the remaining required fields in order', () => {
      const service = configure(true);
      const base = { apiKey: 'k', contractCode: 'c' };
      expect(service.checkInput(base)).toBe('ANGULAR-Monnify: Monnify email cannot be empty');
      expect(service.checkInput({ ...base, customerEmail: 'a@b.com' })).toBe(
        'ANGULAR-Monnify: Monnify name cannot be empty',
      );
      expect(service.checkInput({ ...base, customerEmail: 'a@b.com', customerFullName: 'A B' })).toBe(
        'ANGULAR-Monnify: Monnify phone cannot be empty',
      );
      expect(
        service.checkInput({
          ...base,
          customerEmail: 'a@b.com',
          customerFullName: 'A B',
          customerMobileNumber: '08000000000',
        }),
      ).toBe('ANGULAR-Monnify: Monnify amount cannot be empty');
      expect(
        service.checkInput({
          ...base,
          customerEmail: 'a@b.com',
          customerFullName: 'A B',
          customerMobileNumber: '08000000000',
          amount: 100,
        }),
      ).toBe('ANGULAR-Monnify: Monnify reference cannot be empty');
      expect(
        service.checkInput({
          ...base,
          customerEmail: 'a@b.com',
          customerFullName: 'A B',
          customerMobileNumber: '08000000000',
          amount: 100,
          reference: 'ref-1',
        }),
      ).toBe('');
    });
  });

  describe('getMonnifyOptions', () => {
    it('should prefer per-payment values over the injected ones', () => {
      const options = configure(true).getMonnifyOptions({
        apiKey: 'local',
        contractCode: 'localContract',
        amount: 10,
      });
      expect(options.apiKey).toBe('local');
      expect(options.contractCode).toBe('localContract');
    });

    it('should fall back to the injected values', () => {
      const options = configure(true).getMonnifyOptions({ amount: 10 });
      expect(options.apiKey).toBe('API_KEY');
      expect(options.contractCode).toBe('CONTRACT_CODE');
    });

    it('should default the currency to NGN', () => {
      expect(configure(true).getMonnifyOptions({}).currency).toBe('NGN');
    });

    it('should honour an explicit isTestMode of false even when injected as true', () => {
      // `||` in v1 meant a per-payment `isTestMode: false` was overridden by the
      // injected `true`. `??` keeps the explicit value.
      expect(configure(true).getMonnifyOptions({ isTestMode: false }).isTestMode).toBe(false);
    });

    it('should strip null and undefined values', () => {
      const options = configure(true).getMonnifyOptions({ amount: 10 });
      expect('incomeSplitConfig' in options).toBe(false);
      expect('reference' in options).toBe(false);
    });
  });
});
