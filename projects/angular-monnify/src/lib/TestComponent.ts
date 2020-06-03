import { Component } from '@angular/core';
@Component({
  template: `<button type="text"
    class="btn btn-danger m-3"
    angular-Monnify
    [customerFullName]="'some-random-str'"
    [customerMobileNumber]="'some-random-str'"
    [paymentDescription]="'some-random-str'"
    [customerEmail]="'mailexample@mail.com'"
    [amount]="'5000000'"
    [apiKey]="'some-random-str'"
    [contractCode]="'some-random-str'"
    [reference]="'some-random-str'"
    (paymentInit)="paymentInit()"
    (close)="paymentCancel()"
    (onComplete)="paymentDone($event)"
    [class]="'btn btn-primary btn-lg'"
  >
    Pay
  </button>
  `
})
export class TestComponent {
  paymentInit() {
    return 'initialized';
  }
  paymentDone(ref: any) {
    return 'successful';
  }
  paymentCancel() {
    return 'failed';
  }
}


