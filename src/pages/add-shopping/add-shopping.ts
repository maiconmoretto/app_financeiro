import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';
import { EditShoppingItemPage } from '../edit-shopping-item/edit-shopping-item';
import * as $ from 'jquery';
import { AuthService } from '../../services/auth.service';


@IonicPage()
@Component({
  selector: 'page-add-shopping',
  templateUrl: 'add-shopping.html',
})
export class AddShoppingPage {
  nome;
  categorias = [];
  pessoasCompartilhando = [];
  emailUsuario;
  gastosVariaveis$: FirebaseListObservable<ShoppingItem[]>
  data;
  mes;
  ano;

  constructor(public navCtrl: NavController,
    public NavParams: NavParams,
    private fdb: AngularFireDatabase,
    private toastCtrl: ToastController,
    private database: AngularFireDatabase,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController) {
    if (this.data == undefined) {
      var d = new Date();
      var data = "";
      this.mes = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
      this.ano = d.getFullYear();
    } else {
      this.mes = this.data.substr(5, 2);
      this.ano = this.data.substr(0, 4);
    }
    this.listaCategorias();
    this.verificaSeExisteCompartilhamento();
    this.emailUsuario = this.authService.getCurrentUserEmail;

    this.gastosVariaveis$ =
      this.database.list(this.authService.currentUserId + '/gastos/diversos/' +this.ano + '/' + this.mes + '/');

  }

  listaCategorias(idUsuario = null) {
    let id = idUsuario == null ? this.authService.currentUserId : idUsuario;
    this.fdb.list(id + '/categorias/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.categorias.push(snapshot.val().descricao);
          this.categorias.sort();
        })
      })
  }

  verificaSeExisteCompartilhamento() {
    let self = this;
    this.database.list('/compartilhamento/', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'email_destinatario',
        equalTo: this.authService.getCurrentUserEmail
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().aceito == 'sim') {
            self.pessoasCompartilhando.push(snapshot.val().email_remetente)
            self.listaCategorias(snapshot.val().id_usuario);
          }
        });
      })
  }

  addShoppingItem(descricao, valor, data, gasto_por, categoria, dividir) {

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

    this.fdb.list(this.authService.currentUserId + "/gastos/diversos/" + data.substr(0, 4) + '/' + data.substr(5, 2) + '/').push({
      descricao: descricao,
      valor: valor,
      data: data,
      gasto_por: gasto_por,
      categoria: categoria,
      dividir: dividir,
      cadastrado_por: this.authService.currentUserId,

    });

    let toast = this.toastCtrl.create({
      message: 'Adicionado gasto com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
    // this.navCtrl.pop();
  }

  selectShoppingItem(gastosVariaveis: ShoppingItem) {
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
            this.navCtrl.push(EditShoppingItemPage,
              {
                shoppingItemId: gastosVariaveis.$key,
                ano: this.ano,
                mes: this.mes
              });
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            //delete the current item
            this.gastosVariaveis$.remove(gastosVariaveis.$key);
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

}
