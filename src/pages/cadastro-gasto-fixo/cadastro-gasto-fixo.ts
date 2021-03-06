import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { EditGastoFixoPage } from '../edit-gasto-fixo/edit-gasto-fixo';
import { AuthService } from '../../services/auth.service';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';

@IonicPage()
@Component({
  selector: 'page-cadastro-gasto-fixo',
  templateUrl: 'cadastro-gasto-fixo.html',
})

export class CadastroGastoFixoPage {

  categorias = [];
  gastosFixos$: FirebaseListObservable<ShoppingItem[]>
  pessoasCompartilhando = [];
  emailUsuario ;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private authService: AuthService) {
    this.listaGastosFixos();
    this.listaCategorias();
    this.verificaSeExisteCategorias();
    this.verificaSeExisteCompartilhamento();
    this.emailUsuario = this.authService.getCurrentUserEmail;
  }
 
  listaGastosFixos() {
    this.gastosFixos$ = this.database.list(this.authService.currentUserId + '/gastosFixos/');
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

  adicionarGasto(descricao, valor, categoria, dividir, gasto_por) {
    this.database.list(this.authService.currentUserId + "/gastosFixos/").push({
      descricao: descricao,
      valor: valor,
      categoria: categoria,
      dividir: dividir,
      gasto_por: gasto_por,
      cadastrado_por: this.authService.currentUserId
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



  selectShoppingItem(gastosFixo: ShoppingItem) {
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
            this.navCtrl.push(EditGastoFixoPage,
              {
                shoppingItemId: gastosFixo.$key
              });
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            //delete the current item
            this.gastosFixos$.remove(gastosFixo.$key);
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
