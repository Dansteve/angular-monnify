
import { Component } from '@angular/core';
import { MonnifyOptions } from 'projects/angular-monnify/src/public_api';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title: string;
  tRef: string;

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
    incomeSplitConfig: [
      {
        subAccountCode: 'MFY_SUB_342113621921',
        feePercentage: 50,
        splitAmount: 1900,
        feeBearer: true
      },
      {
        subAccountCode: 'MFY_SUB_342113621922',
        feePercentage: 50,
        splitAmount: 2100,
        feeBearer: true
      }
    ],
  };

  constructor() { }

  paymentInit(res: any) {
    this.options.reference = '' + Math.floor((Math.random() * 1000000000) + 1),
      console.log('Payment initialized');
  }

  paymentDone(res: any) {
    console.log('Payment Done');
    console.log(res);
  }

  paymentCancel(res: any) {
    console.log('Payment Close');
    console.log(res);
  }

}
