import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase ,FirebaseListObservable} from 'angularfire2/database';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';
import { EditShoppingItemPage } from '../edit-shopping-item/edit-shopping-item';
import * as $ from 'jquery';


@IonicPage()
@Component({
  selector: 'page-add-shopping',
  templateUrl: 'add-shopping.html',
})
export class AddShoppingPage {
  nome;


  constructor(public navCtrl: NavController,
    public NavParams: NavParams,
    private fdb: AngularFireDatabase,
    private toastCtrl: ToastController) {
     

  }


  addShoppingItem(descricao, valor, data, gasto_por, categoria,dividir) {
   
    if (descricao == undefined
      || valor == undefined
      || data == undefined
      || gasto_por == undefined
      || categoria == undefined
    ) {
      alert('Preencha todos os campos!');
 
      let msg = this.toastCtrl.create({
        message: 'preencha todos os campos!',
        duration: 3000,
        position: 'top'
      });

      msg.onDidDismiss(() => {
        // console.log('Dismissed toast');
      });
      return;
    }

    this.fdb.list("/gastos/diversos/" + data.substr(0, 4) + '/' + data.substr(5, 2) + '/').push({
      descricao: descricao,
      valor: valor,
      data: data,
      gasto_por: gasto_por,
      categoria: categoria,
      dividir: dividir

    });

    let toast = this.toastCtrl.create({
      message: 'Adicionado gasto com sucesso!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
    // this.navCtrl.pop();
  }


}
