import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController) {
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


  adicionarGasto(descricao, valor, prestacoes, data, gasto_por, categoria) {
    var mes = data.substr(5, 2);
    var ano = data.substr(0, 4);

    // cadastro no node gastosCredito
    this.database.list("/gastosCredito/").push({
      descricao: descricao,
      valor: valor,
      prestacoes: prestacoes,
      data: data,
      categoria: categoria
    });


    for (var i = 0; i < prestacoes; i++) {

      if (mes == 13) {
        mes = "01";
        ano = Number(ano) + Number(1);
      } else {
        if (mes.length != 2) {
          mes = "0" + mes;
        }
      }

      this.database.list("/gastos/credito/" + ano + '/' + mes).push({
        descricao: descricao,
        valor: valor,
        data: data,
        parcela: (i + 1) + "/" + prestacoes,
        gasto_por: gasto_por,
        categoria: categoria
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


}
