import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { AddShoppingPage } from '../pages/add-shopping/add-shopping';
import { CadastroGastoFixoPage } from '../pages/cadastro-gasto-fixo/cadastro-gasto-fixo';
import { GestaoCategoriasPage } from '../pages/gestao-categorias/gestao-categorias';
import { GestaoCreditoPage } from '../pages/gestao-credito/gestao-credito';
import { GestaoReceitaPage } from '../pages/gestao-receita/gestao-receita';
import { DetalheGastosPage } from '../pages/detalhe-gastos/detalhe-gastos';
import { ResumoGastosPage } from '../pages/resumo-gastos/resumo-gastos';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { GestaoCompartilharPage } from '../pages/gestao-compartilhar/gestao-compartilhar';
import { GastoPorCategoriaPage } from '../pages/gasto-por-categoria/gasto-por-categoria';
import { RelatorioGastoPorPessoaPage } from '../pages/relatorio-gasto-por-pessoa/relatorio-gasto-por-pessoa';
  
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  // rootPage: any = ResumoGastosPage;
  rootPage: any = LoginPage;  
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
 
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Página Inicial', component: ResumoGastosPage  },
      { title: 'Detalhe gastos', component: DetalheGastosPage  },
      { title: 'Gasto por Categoria', component: GastoPorCategoriaPage  },
      { title: 'Gasto por Pessoa', component: RelatorioGastoPorPessoaPage  },
      { title: 'Gasto Variável', component: AddShoppingPage },
      { title: 'Gasto Fixo', component: CadastroGastoFixoPage },
      { title: 'Gasto Crédito', component: GestaoCreditoPage },
      { title: 'Receita', component: GestaoReceitaPage },
      { title: 'Categorias', component: GestaoCategoriasPage },
      { title: 'Buscar outro mês', component:  HomePage },
      { title: 'Compartilhar Gastos', component:  GestaoCompartilharPage },
      { title: 'Logout', component:  LogoutPage } 

    ];
 
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}


