import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheGastoPessoaPage } from './detalhe-gasto-pessoa';

@NgModule({
  declarations: [
    DetalheGastoPessoaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheGastoPessoaPage),
  ],
})
export class DetalheGastoPessoaPageModule {}
