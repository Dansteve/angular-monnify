import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { AngularMonnifyModule } from 'angular-monnify';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    // Credentials come from the root `forRoot()` call in AppModule; the plain
    // module import is all a feature module needs.
    AngularMonnifyModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
