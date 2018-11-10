import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { EditCategoriaPage } from '../../pages/edit-categoria/edit-categoria';
import { GestaoReceitaPage } from '../gestao-receita/gestao-receita';


@IonicPage()
@Component({
  selector: 'page-gestao-categorias',
  templateUrl: 'gestao-categorias.html',
})
export class GestaoCategoriasPage {

  categorias$: FirebaseListObservable<ShoppingItem[]>
  firstLogin;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private alertCtrl: AlertController) {
    this.categorias$ = this.database.list(this.authService.currentUserId + '/categorias/');
    this.firstLogin = this.navParams.data.firstLogin;

    let msg = "";
    let title = "";
    title += "Bem vindo ao cadastro de categorias";
    msg += " Aqui você pode cadastrar quantas categorias quiser, " +
      " mas para usar o Family Finance é necessário cadastrar ao menos uma." +
      " Exemplo: lazer; supermercado, transporte.";

    this.navParams.data.firstLogin == true ? this.mensagemPrimeiroLogin(title, msg) : null;

  }

  mensagemPrimeiroLogin(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: 'Cancelar tutorial',
          role: 'cancel',
          handler: () => {
            this.mensagemCancelamentoTutorial();
          }
        },
        {
          text: 'Vamos lá!',
          handler: () => {
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  mensagemCancelamentoTutorial() {
    let alert = this.alertCtrl.create({
      title: "Tutorial cancelado",
      message: "Você pode acessar o tutorial a qualquer hora no menu principal",
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  addCategoria(descricao) {

    if (descricao == undefined) {
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

    this.database.list(this.authService.currentUserId + "/categorias/").push({
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


    let msg = "";
    let title = "";
    title += "Muito bem!";
    msg += "Agora você precisa cadastrar uma receita. Exemplo: salário, freelance.";

    this.navParams.data.firstLogin == true ? this.mensagemPrimeiroLogin(title, msg) : null;
    this.navCtrl.push(GestaoReceitaPage,
      {
        firstLogin: this.firstLogin
      });
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
            this.categorias$.remove(shoppingItem.$key);
          }
        },
        {
          text: 'Edit',
          role: 'destructive',
          handler: () => {
            this.navCtrl.push(EditCategoriaPage,
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
