import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResumoGastosPage } from './resumo-gastos';
 
@NgModule({
  declarations: [
    ResumoGastosPage,
  ],
  imports: [
    IonicPageModule.forChild(ResumoGastosPage),
  ],  
})
export class ResumoGastosPageModule {}
