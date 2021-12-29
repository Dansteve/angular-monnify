import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AngularMonnifyModule } from 'projects/angular-monnify/src/public_api';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    AngularMonnifyModule.forRoot('MK_TEST_SAF7HR5F3F', '4934121693', true)
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
