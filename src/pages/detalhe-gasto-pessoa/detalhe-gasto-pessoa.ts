import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';

@IonicPage()
@Component({
  selector: 'page-detalhe-gasto-pessoa',
  templateUrl: 'detalhe-gasto-pessoa.html',
})
export class DetalheGastoPessoaPage {

  data;
  mes;
  ano;

  total = 0;
  arrayGastosCredito = [];
  arrayGastosFixos = [];
  arrayGastosDiversos = [];

  totalCredito = 0;
  totalDiversos = 0;
  totalFixos = 0;
  nome;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController) {

    this.data = this.navParams.data.data;
    this.nome = this.navParams.data.nome;

    this.mes = this.data.substr(5, 2);
    this.ano = this.data.substr(0, 4);
    this.somaTotalGastos();

  }


  somaTotalGastos() {
    this.database.list('gastos/diversos/' + this.ano + '/' + this.mes,

      {
        query: {
          orderByChild: 'gasto_por',
          equalTo: this.nome
        },
        preserveSnapshot: true 
      },
    
    )
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().gasto_por === this.nome) {
            this.totalDiversos += Math.round(Number(snapshot.val().valor));
            this.arrayGastosDiversos.push(snapshot.val());
          }
        });
      })


    this.database.list('gastos/fixos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().gasto_por === this.nome) {
            console.log('gasto por  fixos = ' + snapshot.val().gasto_por);
            this.totalFixos += Math.round(Number(snapshot.val().valor));
            this.arrayGastosFixos.push(snapshot.val());
          }
        });
      })


    this.database.list('gastosCredito/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var descricao = snapshot.val().descricao;
          var gasto_por = snapshot.val().gasto_por;
          var ano = snapshot.val().ano;
          var mes = snapshot.val().mes;

          this.database.list('gastosCreditoHistorico/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                if (descricao == snapshot.val().descricao
                  && gasto_por == this.nome
                ) {
                  this.arrayGastosCredito.push(snapshot.val());
                  this.totalCredito += Math.round(Number(snapshot.val().valor));
                }
              });
            })
        });
      })

    this.total = Number(this.totalCredito) + Number(this.totalDiversos) + Number(this.totalFixos);

  }

}
