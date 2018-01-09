import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';

import { TabsPage } from '../pages/tabs/tabs';

import { ShoppingListPage } from '../pages/shopping-list/shopping-list';
import { AddShoppingPage } from '../pages/add-shopping/add-shopping';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {FIREBASE_CREDENTIALS} from './firebase.credentials';
import {HomePage} from '../pages/home/home';
import {CadastroGastoFixoPage} from '../pages/cadastro-gasto-fixo/cadastro-gasto-fixo'; 
import {GestaoCreditoPage} from '../pages/gestao-credito/gestao-credito'; 
 
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
    GestaoCreditoPage 
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //inicialize  angular fire 
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFireDatabaseModule
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
    GestaoCreditoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
