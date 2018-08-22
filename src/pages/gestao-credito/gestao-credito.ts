import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { EditCreditoPage } from '../edit-credito/edit-credito';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';





@IonicPage()
@Component({
  selector: 'page-gestao-credito',
  templateUrl: 'gestao-credito.html',
})
export class GestaoCreditoPage {

  categorias = [];
  gastosCredito$: FirebaseListObservable<ShoppingItem[]>
  idsDelete = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController, ) {
    this.gastosCredito$ = this.database.list('gastosCredito/');

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


  adicionarGasto(descricao, valor, prestacoes, data, gasto_por, categoria, dividir) {
    var mes = data.substr(5, 2);
    var ano = data.substr(0, 4);
    var diaAtual = new Date().getDate();
    var mesAtual = new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    var anoAtual = new Date().getFullYear();
    var valorPrestacao = (valor / prestacoes);

    // cadastro no node gastosCredito
    const newId = this.database.list("/gastosCredito/").push({
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
      this.database.list("/prestacoes_credito").push({
        id_item: newId,
        valor: valorPrestacao,
        parcela: (i + 1) + "/" + prestacoes,
        mes: mes,
        ano: ano,
        mes_e_ano: mes + '/' + ano,
        data_cadastro: diaAtual + '/' + mesAtual + '/' + anoAtual,
      });
      mes++;
    }

    let toast = this.toastCtrl.create({
      message: 'Adicionado gasto com crédito com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
    // this.navCtrl.pop();

  }


  selectShoppingItem(gastosCredito: ShoppingItem) {
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

            //deleta o item da prestação de  crédito
            this.database.list('prestacoes_credito', {
              preserveSnapshot: true,
              query: {
                orderByChild: 'id_item',
                equalTo: gastosCredito.$key
              }
            })
              .subscribe(snapshots => {
                snapshots.forEach(snapshot => {
                  this.database.list('prestacoes_credito/' + snapshot.key).remove();
                  this.idsDelete.push(snapshot.key);
                })
              })

            //delete the current item
            this.gastosCredito$.remove(gastosCredito.$key);

          }
        },
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
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
      ]

    }).present();
  }


}
