# ANGULAR-MONNIFY

> This is an angular module that abstracts the complexity of making monnify payments.

## Demo

![Demo](App.png?raw=true "Demo Image")

## USAGE

### 1. Install the module

```sh
npm install --save angular-monnify
```

### 2. Import the module

In your `app.module.ts` or any module where the component or directive would be used like so:

```ts
import { NgModule } from '@angular/core';

import { AngularMonnifyModule } from 'angular-monnify';
...

@NgModule({
  imports: [
    AngularMonnifyModule.forRoot('apiKey','contractCode',false),
  ]
})

export class AppModule {}
```

### 3. Implement in your project

There are two available options

- **AngularMonnifyComponent**: Renders a button which when clicked loads monnify Inline in an iframe

  ```html
  <angular-Monnify
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
  >
    Pay with Monnify
  </angular-Monnify>
  ```

- **AngularMonnifyDirective**: A directive that loads monnify inline in an iframe when clicked

```html
<button
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
  [class]="'btn btn-primary'"
  (close)="paymentCancel()"
  (onComplete)="paymentDone($event)"
>
  Pay with Monnify
</button>
```

And then in your `component.ts`

```ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  reference = '' + Math.floor((Math.random() * 1000000000) + 1);
  constructor() {}

  paymentInit() {
    console.log("Payment initialized");
  }

  paymentDone(info: any) {
    this.title = "Payment successful";
    console.log(this.title, info);
  }

  paymentCancel() {
    console.log("payment failed");
  }

  ngOnInit() {
     this.reference ='' + Math.floor((Math.random() * 1000000000) + 1);
  }
}
```

Also you can use the `monnifyOptions` object like so:

```html
<button
  angular-Monnify
  [monnifyOptions]="options"
  (paymentInit)="paymentCancel()"
  (close)="paymentCancel()"
  (onComplete)="paymentDone($event)"
>
  Pay with Monnify
</button>
```

And then in your `component.ts`

```ts
import { Component } from "@angular/core";
import { MonnifyOptions } from "angular-monnify";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  options: MonnifyOptions = {
    amount: 5000,
    currency: 'NGN',
    reference: '' + Math.floor((Math.random() * 1000000000) + 1),
    customerFullName: 'John Doe',
    customerEmail: 'monnify@monnify.com',
    customerMobileNumber: '08121281921',
    apiKey: 'MK_TEST_SAF7HR5F3F',
    contractCode: '4934121693',
    paymentDescription: 'Test Pay',
    isTestMode: true,
    metadata: {
      name: 'Damilare',
      age: 45
    },
  };
  constructor() {}

  paymentInit() {
    console.log("Payment initialized");
  }

  paymentDone(info: any) {
    this.title = "Payment successful";
    console.log(this.title, info);
  }

  paymentCancel() {
    console.log("payment failed");
  }
}
```

Also, you can pass in a apiKey and contractCode in the component and the directive, in such situation, this apiKey and contractCode is given a higher preference over the global `forRoot` apiKey and contractCode. For example, if you have this is your file

```ts
@NgModule({
  imports: [
    AngularMonnifyModule.forRoot('apiKey','contractCode',false),
  ]
})
```

and this in your component

```html
<button
  angular-Monnify
  [customerFullName]="'some-random-str'"
  [customerMobileNumber]="'some-random-str'"
  [paymentDescription]="'some-random-str'"
  [customerEmail]="'mailexample@mail.com'"
  [amount]="'5000000'"
  [apiKey]="'apiKey2'"
  [contractCode]="'contractCode2'"
  [reference]="'some-random-str'"
  (paymentInit)="paymentInit()"
  (close)="paymentCancel()"
  (onComplete)="paymentDone($event)"
>
  Pay with Monnify
</button>
```

Then `apiKey2` and `contractCode2` would be used instead

## OPTIONS

| Field              | Description                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| amount <sup>(M)</sup>               | The amount to be paid by the customer      
| currency <sup>(M)</sup>             | The currency of the transaction being initialized. "NGN"                                                                                                                                                     |
| reference <sup>(M)</sup>            | Merchant's Unique reference for every transaction. (The SDK already has a code snippet that generates this for you, but you can always replace it)                                                           |
| customerName <sup>(M)</sup>         | Full name of the customer                                                                                                                                                                                    |
| customerEmail <sup>(M)</sup>        | Email address of the customer                                                                                                                                                                                |
| customerMobileNumber <sup>(M)</sup> | Phone number of the customer                                                                                                                                                                                 |
| apiKey <sup>(M)</sup>               | Merchant's API Key (Can be found on the Monnify dashboard)                                                                                                                                                   |
| contractCode <sup>(M)</sup>         | Merchant's contract code (Can be found on the Monnify dashboard)                                                                                                                                             |
| paymentDescription <sup>(M)</sup>   | Description for the transaction. Will be used as the account name for bank transfer payments                                                                                                                 |
| isTestMode <sup>(M)</sup>           | Should be set to true when using the sandbox and false when on production                                                                                                                                    |
| transactionHash <sup>(M)</sup>      | Transaction Hash added to transaction response for security purposes. [Click here](https://docs.teamapt.com/display/MON/Calculating+the+Transaction+Hash) for information on how to calculate the hash value |
| paymentStatus <sup>(M)</sup>        | Status of the transaction ("PAID", "PENDING" or "FAILED")                                                                                                                                                    |
| incomeSplitConfig                   | Object containing specifications on how payments to this reserve account should be split.                                                                                                                    |
| subAccountCode <sup>(m)</sup>       | The unique reference for the sub account that should receive the split.                                                                                                                                      |
| feeBearer                           | Boolean to determine if the sub account should bear transaction fees or not                                                                                                                                  |
| feePercentage                       | The percentage of the transaction fee to be borne by the sub account                                                                                                                                         |
| splitPercentage                     | The percentage of the amount paid to be split into the sub account.                                                                                                                                          |

> For more information checkout [monnify's documentation](https://teamapt.atlassian.net/wiki/spaces/MON/pages/212008793/Monnify+Web+SDK)

## Contributing

Please feel free to fork this package and contribute by submitting a pull request to enhance the functionalities.

## How can I thank you?

Why not star the github repo? I'd love the attention! Why not share the link for this repository on Twitter or anywhere? Spread the word!

Don't forget to [follow me on twitter](https://twitter.com/dansteveade)!

Thanks!
Dansteve Adekanbi.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
