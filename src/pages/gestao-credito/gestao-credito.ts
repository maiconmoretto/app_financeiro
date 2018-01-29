import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';


@IonicPage()
@Component({
  selector: 'page-gestao-credito',
  templateUrl: 'gestao-credito.html',
})
export class GestaoCreditoPage {

  gastosCredito$: FirebaseListObservable<ShoppingItem[]>
  constructor(public navCtrl: NavController, public navParams: NavParams, private database: AngularFireDatabase) {
    this.gastosCredito$ = this.database.list('gastosCredito/');
  }


  adicionarGasto(descricao, valor, prestacoes, data, gasto_por,categoria) {
    var mes = data.substr(5, 2);
    var ano = data.substr(0, 4);

    //cadastro no node gastosCredito
    this.database.list("/gastosCredito/").push({
      descricao: descricao,
      valor: valor,
      prestacoes: prestacoes,
      data: data,
      categoria:categoria
    });


    for (var i = 0; i < prestacoes; i++) {

      if (mes == 13) {
        mes = "01";
        ano = Number(ano) + Number(1);
      } else {
        if (mes < 10) {
          if (mes != "01") {
            mes = "0" + mes;
          }
        }
      }


      this.database.list("/gastos/credito/" + ano + '/' + mes).push({
        descricao: descricao,
        valor: valor,
        data: data,
        parcela: (i + 1) + "/" + prestacoes,
        gasto_por: gasto_por,
        categoria:categoria
      });
      mes++;
    }
  }


}
