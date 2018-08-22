import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cadastro-gasto-fixo',
  templateUrl: 'cadastro-gasto-fixo.html',
})

export class CadastroGastoFixoPage {
  categorias = [];
  gastosFixos$: FirebaseListObservable<ShoppingItem[]>
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController) {
    this.gastosFixos$ = this.database.list('gastosFixos/');
    this.listaCategorias();
  }

  listaCategorias() {
    this.database.list('/categorias/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.categorias.push(snapshot.val().descricao);
          this.categorias.sort();
        })
      })
  }
 
  adicionarGasto(descricao, valor, categoria,dividir,gasto_por) {
    this.database.list("/gastosFixos/").push({
      descricao: descricao,
      valor: valor,
      categoria: categoria,
      dividir: dividir,
      gasto_por: gasto_por,
    });
    let toast = this.toastCtrl.create({
      message: 'Adicionado gasto fixo com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });
    toast.present();
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
