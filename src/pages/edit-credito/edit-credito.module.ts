import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCreditoPage } from './edit-credito';

@NgModule({
  declarations: [
    EditCreditoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCreditoPage),
  ],
})
export class EditCreditoPageModule {}
