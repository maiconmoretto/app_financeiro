import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../services/auth.service";
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';
/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService
  ) {

    let msg = "Bem vindo " + this.authService.getCurrentUserEmail + "! "
    msg += "Para começar a usar o Family Finance você precisa: " +
      "\n1 - Cadastrar uma categoria;" +
      "\n2 - Cadastrar uma receita;" +
      "\n3 - Cadastrar um gasto";
    alert(msg);

    this.navCtrl.push(GestaoCategoriasPage, {
      firstLogin: true
    });
  }


}
