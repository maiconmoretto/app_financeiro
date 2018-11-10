import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { EditReceitaPage } from '../../pages/edit-receita/edit-receita';

@IonicPage()
@Component({
  selector: 'page-gestao-receita',
  templateUrl: 'gestao-receita.html',
})
export class GestaoReceitaPage {

  receita$: FirebaseListObservable<ShoppingItem[]>;
  firstLogin;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private authService: AuthService) {
    this.buscaReceita();
    this.firstLogin = this.navParams.data.firstLogin;
  }

  buscaReceita() {
    this.receita$ = this.database.list(this.authService.currentUserId + '/receita/');
  }

  adicionarReceita(descricao, valor, data) {

    var mes = data.substr(5, 2);
    var ano = data.substr(0, 4);


    this.database.list(this.authService.currentUserId + "/receita/").push({
      descricao: descricao,
      valor: valor,
      mes: mes,
      ano: ano,
      data: mes + "/" + ano,
      cadastrado_por: this.authService.currentUserId
    });


    let toast = this.toastCtrl.create({
      message: 'Adicionada receita com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });
    if (this.firstLogin == true) {
      alert('Muito bem' + this.authService.getCurrentUserEmail + '! Vamos adicionar uma gasto?. Ex: lanche.')
      this.navCtrl.push(AddShoppingPage,
        {
          firstLogin: this.firstLogin
        });
    }
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
            text: 'Edit',
            role: 'destructive',
            handler: () => {
              //send the item to edit item and pass key as parameter
              this.navCtrl.push(EditReceitaPage,
                {
                  shoppingItemId: shoppingItem.$key
                });
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
