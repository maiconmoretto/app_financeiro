import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GestaoCategoriasPage } from './gestao-categorias';

@NgModule({
  declarations: [
    GestaoCategoriasPage,
  ],
  imports: [
    IonicPageModule.forChild(GestaoCategoriasPage),
  ],
})
export class GestaoCategoriasPageModule {}
