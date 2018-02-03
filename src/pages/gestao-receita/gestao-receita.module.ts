import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GestaoReceitaPage } from './gestao-receita';

@NgModule({
  declarations: [
    GestaoReceitaPage,
  ],
  imports: [
    IonicPageModule.forChild(GestaoReceitaPage),
  ],
})
export class GestaoReceitaPageModule {}
