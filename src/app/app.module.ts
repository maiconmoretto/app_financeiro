import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireAuth } from 'angularfire2/auth';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';

import { TabsPage } from '../pages/tabs/tabs';
 
import { ShoppingListPage } from '../pages/shopping-list/shopping-list';
import { AddShoppingPage } from '../pages/add-shopping/add-shopping';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {firebaseConfig} from './firebase.credentials';
import {HomePage} from '../pages/home/home';
import {CadastroGastoFixoPage} from '../pages/cadastro-gasto-fixo/cadastro-gasto-fixo'; 
import {GestaoCreditoPage} from '../pages/gestao-credito/gestao-credito'; 
import {EditShoppingItemPage} from '../pages/edit-shopping-item/edit-shopping-item'; 
import {GestaoCategoriasPage} from '../pages/gestao-categorias/gestao-categorias'; 
import { GestaoReceitaPage } from '../pages/gestao-receita/gestao-receita';
import { ResumoGastosPage } from '../pages/resumo-gastos/resumo-gastos';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LogoutPage } from '../pages/logout/logout';
import { EditCreditoPage } from '../pages/edit-credito/edit-credito';
import { EditGastoFixoPage } from '../pages/edit-gasto-fixo/edit-gasto-fixo';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
   ShoppingListPage,
   AddShoppingPage,
    TabsPage,
    HomePage,
    CadastroGastoFixoPage,
    GestaoCreditoPage,
    EditShoppingItemPage,
    GestaoCategoriasPage,
    GestaoReceitaPage,
    ResumoGastosPage,
    LoginPage,
    LogoutPage,
    EditCreditoPage,
    EditGastoFixoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //inicialize  angular fire 
    AngularFireModule.initializeApp(firebaseConfig.fire),
    AngularFireDatabaseModule,
    AngularFireAuthModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    ShoppingListPage,
    AddShoppingPage,
    TabsPage,
    HomePage,
    ShoppingListPage,
    CadastroGastoFixoPage,
    GestaoCreditoPage,
    EditShoppingItemPage,
    GestaoCategoriasPage,
    GestaoReceitaPage,
    ResumoGastosPage,
    LoginPage,
    LogoutPage, 
    EditCreditoPage,
    EditGastoFixoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    AuthService, 
  ]
})
export class AppModule {}
