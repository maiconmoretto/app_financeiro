import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EdiShoppingItemPage } from './edi-shopping-item';

@NgModule({
  declarations: [
    EdiShoppingItemPage,
  ],
  imports: [
    IonicPageModule.forChild(EdiShoppingItemPage),
  ],
})
export class EdiShoppingItemPageModule {}
