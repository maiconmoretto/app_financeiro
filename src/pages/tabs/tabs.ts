import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CadastroGastoFixoPage } from '../cadastro-gasto-fixo/cadastro-gasto-fixo';
import { GestaoCreditoPage } from '../gestao-credito/gestao-credito';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';
import { GestaoReceitaPage } from '../gestao-receita/gestao-receita';
import { ShoppingListPage } from '../shopping-list/shopping-list';

import { AuthService } from '../../services/auth.service';
 
  
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
 
  tab1Root = ShoppingListPage; 
  tab2Root = CadastroGastoFixoPage;
  tab3Root = GestaoCreditoPage;
  tab4Root = GestaoCategoriasPage;
  tab5Root = GestaoReceitaPage;
  tab6Root = HomePage;
 
  constructor(
    private authService: AuthService) {

  }
  ionViewCanEnter() {
    return this.authService.authenticated();
  }
}
