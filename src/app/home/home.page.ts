import { Component } from '@angular/core';
import { MonnifyOptions } from 'angular-monnify';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  options: MonnifyOptions = {
    amount: 5000,
    currency: 'NGN',
    reference: '' + Math.floor(Math.random() * 1000000000 + 1),
    customerFullName: 'John Doe',
    customerEmail: 'monnify@monnify.com',
    customerMobileNumber: '08121281921',
    apiKey: 'MK_TEST_GC3B8XG2XX',
    contractCode: '5867418298',
    paymentDescription: 'Test Pay',
    isTestMode: true,
    metadata: {
      name: 'Damilare',
      age: 45,
    },
    incomeSplitConfig: [
      {
        subAccountCode: 'MFY_SUB_342113621921',
        feePercentage: 50,
        splitAmount: 1900,
        feeBearer: true,
      },
      {
        subAccountCode: 'MFY_SUB_342113621922',
        feePercentage: 50,
        splitAmount: 2100,
        feeBearer: true,
      },
    ],
  };

  paymentInit(): void {
    // Monnify rejects a re-used reference, so mint a fresh one per attempt.
    this.options.reference = '' + Math.floor(Math.random() * 1000000000 + 1);
    console.log('Payment initialized');
  }

  paymentDone(res: unknown): void {
    console.log('Payment Done', res);
  }

  paymentCancel(res: unknown): void {
    console.log('Payment Close', res);
  }
}
