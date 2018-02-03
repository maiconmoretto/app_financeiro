import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-gestao-receita',
  templateUrl: 'gestao-receita.html',
})
export class GestaoReceitaPage {

  receita$: FirebaseListObservable<ShoppingItem[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController) {
    this.buscaReceita();
  }

  buscaReceita() {
    this.receita$ = this.database.list('receita/');
  }

  adicionarReceita(descricao, valor, data) {

    var mes = data.substr(5, 2);
    var ano = data.substr(0, 4);


    this.database.list("/receita/").push({
      descricao: descricao,
      valor: valor,
      mes: mes,
      ano: ano,
    });


    let toast = this.toastCtrl.create({
      message: 'Adicionada receita com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });
  }



  selectShoppingItem(shoppingItem: ShoppingItem) {
    console.log(shoppingItem);
    //display a actionsheet
    //1 - edit 
    //2 - remove item
    //3 - cancel selection
    this.actionSheetCtrl.create({
      title: '',
      buttons: [

        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            //delete the current item
            this.receita$.remove(shoppingItem.$key);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('the user has selected the cancel button');

          }
        },
      ]


    }).present();

  }

}
