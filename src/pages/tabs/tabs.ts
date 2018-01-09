import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CadastroGastoFixoPage } from '../cadastro-gasto-fixo/cadastro-gasto-fixo';
import { GestaoCreditoPage } from '../gestao-credito/gestao-credito';

 
  
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
 
  tab1Root = HomePage;
  tab2Root = CadastroGastoFixoPage;
  tab3Root = GestaoCreditoPage;
 
  constructor() {

  }
}
