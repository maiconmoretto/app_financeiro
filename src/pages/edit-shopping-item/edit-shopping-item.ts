import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';

@Component({
  selector: 'page-edit-shopping-item',
  templateUrl: 'edit-shopping-item.html',
})
export class EditShoppingItemPage {

  shoppingItemRef$: FirebaseObjectObservable<ShoppingItem>;
  shoppingItem = {} as ShoppingItem;
  pessoasCompartilhando = [];
  categorias = [];
  emailUsuario;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private authService: AuthService) {
    //capture the shopping item id as  a nagParameter
    const shoppingItemId = this.navParams.get('shoppingItemId');
    const ano = this.navParams.get('ano');
    const mes = this.navParams.get('mes');

    //set  the scope of our  firebase object to our selected item
    this.shoppingItemRef$ = this.database.object(
      this.authService.currentUserId + `/gastos/diversos/` + ano + `/` + mes + `/${shoppingItemId}`);

    //sucbscibe the  object, and assing the result  to this.ShoppingItem
    this.shoppingItemRef$.subscribe(
      shoppingItem => this.shoppingItem = shoppingItem);
    this.listaCategorias();
    this.verificaSeExisteCategorias();
    this.verificaSeExisteCompartilhamento();
    this.emailUsuario = this.authService.getCurrentUserEmail;
  }


  listaCategorias(idUsuario = null) {
    idUsuario = idUsuario == null ? this.authService.currentUserId : idUsuario;
    this.database.list(idUsuario + '/categorias/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.categorias.push(snapshot.val().descricao);
          this.categorias.sort();
        })
      })
  }

  verificaSeExisteCategorias() {
    this.database.list(this.authService.currentUserId + '/categorias/')
      .subscribe(data => {
        if (data.length == 0) {
          alert('Não existem categorias cadastras, é necessário cadastrar!')
          this.navCtrl.push(GestaoCategoriasPage);
        }
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
            self.listaCategorias(snapshot.val().id_usuario);
            self.pessoasCompartilhando.push(snapshot.val().email_remetente)
          }
        });
      })
  }



  //update  our  firebase node  whit new item data
  editShoppingItem(shoppingItem: ShoppingItem) {
    this.shoppingItemRef$.update(shoppingItem);
    let toast = this.toastCtrl.create({
      message: 'Gasto editado com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });
    toast.present();
  }


}
