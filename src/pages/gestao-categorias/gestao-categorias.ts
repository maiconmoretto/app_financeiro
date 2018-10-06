import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-gestao-categorias',
  templateUrl: 'gestao-categorias.html',
})
export class GestaoCategoriasPage {

  categorias$: FirebaseListObservable<ShoppingItem[]>

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService) {
    this.categorias$ = this.database.list('categorias/');
  }

  addCategoria(descricao) {
   
    if (descricao == undefined ) {
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

    this.database.list(this.authService.currentUserId+"/categorias/").push({
      descricao: descricao,
      cadastrado_por: this.authService.currentUserId

    });

    let toast = this.toastCtrl.create({
      message: 'Adicionado categoria com sucesso!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
    // this.navCtrl.pop();
  }


  selectCategoriaItem(shoppingItem: ShoppingItem) {
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
            this.categorias$.remove(shoppingItem.$key);
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
