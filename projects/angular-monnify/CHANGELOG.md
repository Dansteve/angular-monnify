# Changelog

## 2.0.0

### 🔒 Security

- **Production builds no longer load the Monnify sandbox SDK.** In every release up to and
  including `1.3.2`, `loadScript()` had an `if (this.isTestMode)` whose two branches were
  identical — both loaded `https://sandbox.sdk.monnify.com/plugin/monnify.js`. Setting
  `isTestMode: false` had no effect and the production SDK
  (`https://sdk.monnify.com/plugin/monnify.js`) was never used. **If you shipped 1.x to
  production, your customers were sent through the sandbox checkout and no real money moved.**
  Upgrade and reconcile any transactions you believed were live.
  A regression test now asserts that test mode and production can never resolve to the same URL.
- `isTestMode` now defaults to `false` (production) when nothing is registered, so an
  unconfigured app cannot silently transact against the sandbox.

### 💥 Breaking changes

- Requires **Angular 16+**. Built and tested against Angular 20. (1.x supported Angular 8–12.)
- Package output is now modern Ivy partial-compilation (`fesm2022` + `index.d.ts` + an
  `exports` map). The View-Engine-era `bundles/*.umd.js`, `esm5`, `fesm5`, `esm2015` and
  `metadata.json` entry points are gone.
- `ng-packagr` is no longer a `peerDependency`. Consumers no longer have to install a build tool.
- `AngularMonnifyDirective` no longer declares `class` and `style` inputs. It never used them,
  and declaring them meant a `[class]` binding on the host was swallowed rather than applied.
  Native `class` / `[class]` / `[ngClass]` now work as expected. The **component** keeps both.
- The missing-apiKey message changed from `'ANGULAR-Monnify: Please insert a your apiKey'` to
  `'ANGULAR-Monnify: Monnify apiKey cannot be empty'`.
- `loadScript()` now rejects if the SDK script fails to load, instead of hanging forever.
- `AngularMonnifyService` now uses `inject()` rather than constructor parameter injection.

### ✨ Added

- **Standalone support.** `AngularMonnifyComponent` and `AngularMonnifyDirective` are now
  standalone and can be imported directly.
- `provideAngularMonnify(apiKey, contractCode, isTestMode?)` — the standalone counterpart to
  `AngularMonnifyModule.forRoot()`.
- Exported `AngularMonnifyService`, the `API_KEY` / `CONTRACT_CODE` / `IS_TEST_MODE` injection
  tokens, and the `MONNIFY_LIVE_SDK_URL` / `MONNIFY_SANDBOX_SDK_URL` constants (useful for CSP
  allow-lists).
- `AngularMonnifyService.getScriptUrl(test?)` to resolve the SDK URL for a given mode.
- Exported the `MonnifySplitOptions` and `PrivateMonnifyOptions` types.

### 🐛 Fixed

- A `contractCode` supplied only via `forRoot()` / `provideAngularMonnify()` is now honoured.
  1.x only checked the per-payment value and always reported it missing.
- Checkout can be re-opened after the modal is closed. 1.x set an internal `isPaying` flag and
  never cleared it, so the second and every later click silently did nothing.
- A per-payment `isTestMode: false` is no longer overridden by a root-level `true`
  (`||` → `??`).
- The component/directive now pass the resolved `isTestMode` through to `loadScript()`, so a
  per-payment mode actually selects the right SDK.
- Removed a stray `console.log('loaded')` that fired on every checkout.
- Replaced the deprecated `EventEmitter.observers.length` with `.observed`
  (`.observers` is removed in newer RxJS).
- `AngularMonnifyModule.forRoot()` returns `ModuleWithProviders<AngularMonnifyModule>` instead
  of `ModuleWithProviders<any>`.
- JSDoc links now point at <https://developers.monnify.com/>; the old `docs.teamapt.com` links
  no longer resolve.

### 🧹 Internal

- Migrated `tslint` → ESLint (flat config, `angular-eslint` v20).
- Added the missing `angular-monnify` project to `angular.json`; `ng build angular-monnify`,
  `ng test angular-monnify` and `ng lint angular-monnify` previously could not work at all.
- Replaced the stale unit tests (which asserted error messages and a `service.mid` property
  that never existed) with 38 hermetic specs that stub the SDK instead of hitting the network.
- Dropped the EOL protractor e2e suite and unused dependencies
  (`@angular/fire`, `@ionic-native/*`, `firebase-tools`, and others).

## 1.1.0

- Initial documented release.
