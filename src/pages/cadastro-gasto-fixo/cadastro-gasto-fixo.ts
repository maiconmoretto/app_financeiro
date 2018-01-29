import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';

@IonicPage()
@Component({
  selector: 'page-cadastro-gasto-fixo',
  templateUrl: 'cadastro-gasto-fixo.html',
})

export class CadastroGastoFixoPage {

  gastosFixos$: FirebaseListObservable<ShoppingItem[]>
  constructor(public navCtrl: NavController, public navParams: NavParams, private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController) {
    this.gastosFixos$ = this.database.list('gastosFixos/');
  } 

  

  adicionarGasto(descricao,valor,categoria){
    this.database.list("/gastosFixos/").push({
      descricao: descricao,
      valor: valor,
      categoria: categoria
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
          text: 'Edit',
          handler: () => {
            //send the item to edit item and pass key as parameter

          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            //delete the current item
            this.gastosFixos$.remove(shoppingItem.$key);
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

  navigateToaddShoppingPage() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }


}
