import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GestaoCompartilharPage } from './gestao-compartilhar';

@NgModule({
  declarations: [
    GestaoCompartilharPage,
  ],
  imports: [
    IonicPageModule.forChild(GestaoCompartilharPage),
  ],
})
export class GestaoCompartilharPageModule {}
