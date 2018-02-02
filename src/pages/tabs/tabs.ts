import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CadastroGastoFixoPage } from '../cadastro-gasto-fixo/cadastro-gasto-fixo';
import { GestaoCreditoPage } from '../gestao-credito/gestao-credito';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';

 
  
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
 
  tab1Root = HomePage;
  tab2Root = CadastroGastoFixoPage;
  tab3Root = GestaoCreditoPage;
  tab4Root = GestaoCategoriasPage;
 
  constructor() {

  }
}
