import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GestaoCreditoPage } from './gestao-credito';

@NgModule({
  declarations: [
    GestaoCreditoPage,
  ],
  imports: [
    IonicPageModule.forChild(GestaoCreditoPage),
  ],
})
export class GestaoCreditoPageModule {}
