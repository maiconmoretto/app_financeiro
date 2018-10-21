import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/take';
import { AuthService } from '../../services/auth.service';
import { GestaoCategoriasPage } from '../gestao-categorias/gestao-categorias';

@IonicPage()
@Component({
  selector: 'page-edit-credito',
  templateUrl: 'edit-credito.html',
})


export class EditCreditoPage {

  shoppingItemRef$: FirebaseObjectObservable<ShoppingItem>;
  shoppingItem = {} as ShoppingItem;
  categorias = [];
  idsDelete = [];
  emailUsuario;
  pessoasCompartilhando = [];

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
    this.shoppingItemRef$ = this.database.object(this.authService.currentUserId + `/gastosCredito/${shoppingItemId}`);

    this.removeItensAntigos();
    //sucbscibe the  object, and assing the result  to this.ShoppingItem
    this.shoppingItemRef$.subscribe(
      shoppingItem => this.shoppingItem = shoppingItem);
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

  //update  our  firebase node  whit new item data
  editShoppingItem(shoppingItem: ShoppingItem) {
    try {
      this.editarItem(shoppingItem);

    } finally {

      for (var $i = 0; $i <= this.idsDelete.length; $i++) {
        this.database.list('prestacoes_credito/' + this.idsDelete[$i]).remove();
      }
      this.cadastraNovosItens();
    }
  }

  removeItensAntigos() {
    //lista todas presatacoes d credito e remove 
    var objectSubscription = this.database.list('prestacoes_credito', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'id_item',
        equalTo: this.navParams.get('shoppingItemId')
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.idsDelete.push(snapshot.key);
        })
      })
    objectSubscription.unsubscribe;
    objectSubscription.remove;
    objectSubscription.closed;
    // this.database.list('prestacoes_credito/' + this.idsDelete).remove();

  }

  editarItem(shoppingItem) {
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

  cadastraNovosItens() {
    var diaAtual = new Date().getDate();
    var mesAtual = new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    var anoAtual = new Date().getFullYear();
    var prestacoes = 0;
    var valorPrestacao = 0;
    var mes;
    var ano;
    this.database.list('gastosCredito', {
      preserveSnapshot: true,
      query: {
        orderByKey: this.navParams.get('shoppingItemId'),
        equalTo: this.navParams.get('shoppingItemId')
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          prestacoes = snapshot.val().prestacoes;
          mes = snapshot.val().mes;
          ano = snapshot.val().ano;
          valorPrestacao = snapshot.val().valor;

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
            //insere na pasta prestacoes credito o item listado acima
            this.database.list("/prestacoes_credito/").push({
              id_item: this.navParams.get('shoppingItemId'),
              valor: valorPrestacao / prestacoes,
              parcela: (i + 1) + "/" + prestacoes,
              mes: mes,
              ano: ano,
              mes_e_ano: mes + '/' + ano,
              data_cadastro: diaAtual + '/' + mesAtual + '/' + anoAtual,
            });
            mes++;
          }
        })
      })
  }


  //script de migracao de  formtato de credito
  cadastraItens() {
    var diaAtual = new Date().getDate();
    var mesAtual = new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    var anoAtual = new Date().getFullYear();
    var prestacoes = 0;
    var valorPrestacao = 0;
    var descricao;
    var id_item;
    var mes;
    var ano;
    this.database.list('gastosCredito', {
      preserveSnapshot: true,

    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          prestacoes = snapshot.val().prestacoes;
          mes = snapshot.val().mes;
          ano = snapshot.val().ano;
          valorPrestacao = snapshot.val().valor;
          descricao = snapshot.val().descricao;
          id_item = snapshot.key;

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
            //insere na pasta prestacoes credito o item listado acima
            this.database.list("/prestacoes_credito/").push({
              id_item: id_item,
              valor: valorPrestacao,
              parcela: (i ) + "/" + prestacoes,
              mes: mes,
              ano: ano,
              mes_e_ano: mes + '/' + ano,
              data_cadastro: diaAtual + '/' + mesAtual + '/' + anoAtual,
            });
            mes++;
          }
        })
      })
  }


}
