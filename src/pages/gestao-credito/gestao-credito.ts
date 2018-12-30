import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { EditCreditoPage } from '../edit-credito/edit-credito';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';

@IonicPage()
@Component({
  selector: 'page-gestao-credito',
  templateUrl: 'gestao-credito.html',
})
export class GestaoCreditoPage {

  categorias = [];
  gastosCredito$: FirebaseListObservable<ShoppingItem[]>
  idsDelete = [];
  pessoasCompartilhando = [];
  emailUsuario;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService
  ) {
    this.listaGastosCredito();
    this.listaCategorias();
    this.verificaSeExisteCategorias();
    this.verificaSeExisteCompartilhamento();
    this.emailUsuario = this.authService.getCurrentUserEmail;
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

  listaGastosCredito() {
    this.gastosCredito$ = this.database.list(this.authService.currentUserId + '/gastosCredito/');
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


  adicionarGasto(descricao, valor, prestacoes, data, gasto_por, categoria, dividir) {
    var mes = data.substr(5, 2);
    var ano = data.substr(0, 4);
    var diaAtual = new Date().getDate();
    var mesAtual = new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    var anoAtual = new Date().getFullYear();
    var valorPrestacao = (valor / prestacoes);

    // cadastro no node gastosCredito
    const newId = this.database.list(this.authService.currentUserId + "/gastosCredito/").push({
      descricao: descricao,
      valor: valor,
      prestacoes: prestacoes,
      dataInicio: data,
      mes: mes,
      ano: ano,
      categoria: categoria,
      gasto_por: gasto_por,
      dividir: dividir,
      data_cadastro: diaAtual + '/' + mesAtual + '/' + anoAtual,
      cadastrado_por: this.authService.currentUserId
    }).key;

    for (var i = 0; i < prestacoes; i++) {
      if (mes == 13) {
        mes = "01";
        ano = Number(ano) + Number(1);
      } else {
        if (mes < 10) {
          if (mes.length != 2) {
            mes = "0" + mes;
          }
        }
      }
      this.database.list(this.authService.currentUserId + "/prestacoes_credito").push({
        id_item: newId,
        valor: valorPrestacao,
        parcela: (i + 1) + "/" + prestacoes,
        mes: mes,
        ano: ano,
        mes_e_ano: mes + '/' + ano,
        data_cadastro: diaAtual + '/' + mesAtual + '/' + anoAtual,
        cadastrado_por: this.authService.currentUserId
      });
      mes++;
    }
    let toast = this.toastCtrl.create({
      message: 'Adicionado gasto com crédito com sucesso!',
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }


  selectShoppingItem(gastosCredito: ShoppingItem) {
    this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            //send the item to edit item and pass key as parameter
            this.navCtrl.push(EditCreditoPage,
              {
                shoppingItemId: gastosCredito.$key
              });
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {

            //deleta o item da prestação de  crédito
            this.database.list(this.authService.currentUserId +'/prestacoes_credito', {
              preserveSnapshot: true,
              query: {
                orderByChild: 'id_item',
                equalTo: gastosCredito.$key
              }
            })
              .subscribe(snapshots => {
                snapshots.forEach(snapshot => {
                  this.database.list(this.authService.currentUserId +'/prestacoes_credito/' + snapshot.key).remove();
                  this.idsDelete.push(snapshot.key);
                })
              })

            //delete the current item
            this.gastosCredito$.remove(gastosCredito.$key);

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
