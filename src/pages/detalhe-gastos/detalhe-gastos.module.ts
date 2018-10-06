import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheGastosPage } from './detalhe-gastos';

@NgModule({
  declarations: [
    DetalheGastosPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheGastosPage),
  ],
})
export class DetalheGastosPageModule {}
