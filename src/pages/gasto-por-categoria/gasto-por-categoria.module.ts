import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GastoPorCategoriaPage } from './gasto-por-categoria';

@NgModule({
  declarations: [
    GastoPorCategoriaPage,
  ],
  imports: [
    IonicPageModule.forChild(GastoPorCategoriaPage),
  ],
})
export class GastoPorCategoriaPageModule {}
