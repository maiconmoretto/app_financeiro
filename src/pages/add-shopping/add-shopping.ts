import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the AgendamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-shopping',
  templateUrl: 'add-shopping.html',
})
export class AddShoppingPage {
  nome;

  constructor(public navCtrl: NavController, public NavParams: NavParams, private fdb: AngularFireDatabase) {


  }


  addShoppingItem(nome,numero) {


    this.fdb.list("/shopping-list").push({
      itemName: nome,
      itemNumber: numero,

    });


    this.navCtrl.popToRoot();
  }


}
