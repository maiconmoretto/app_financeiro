import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingListPage } from '../shopping-list/shopping-list';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-resumo-gastos',
  templateUrl: 'resumo-gastos.html',
})
export class ResumoGastosPage {

  shoppingListRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosFixosRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosCreditoRef$: FirebaseListObservable<ShoppingItem[]>;
  saldoMes = 0;
  data;
  gastoMes = 0;
  gastoFixo = 0;;
  gastosCredito = 0;
  gastosDiversos = 0;
  restante = 0;
  arrayGastoCredito = [];
  mes;
  ano;
  stringMes;
  totalCredito = 0;
  totalDiversos = 0;
  totalFixos = 0;
  listaMaioresGastos = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) {

    this.data = this.navParams.data.obj;



    if (this.data == undefined) {
      var d = new Date();
      var data = "";
      this.mes = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
      this.ano = d.getFullYear();
    } else {
      this.mes = this.data.substr(5, 2);
      this.ano = this.data.substr(0, 4);
    }


    this.buscaMes();
    this.somaTotalReceita();
    this.somaTotalGastos();
    this.buscaGastos();
  }

  somaTotalReceita() {
    this.database.list('receita/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          if (snapshot.val().ano == this.ano && snapshot.val().mes == this.mes) {
            total += Number(snapshot.val().valor);
          }
        });
        this.saldoMes = total;
      })
  }

  buscaGastos() {
    this.shoppingListRef$ = this.database.list('gastos/diversos/' + this.ano + '/' + this.mes);
    this.gastosFixosRef$ = this.database.list('gastos/fixos/' + this.ano + '/' + this.mes);
  }

  somaTotalGastos() {
    var total = 0;
    this.database.list('gastos/diversos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.adicionaGastos(snapshot.val());
          total += Number(snapshot.val().valor);
          this.totalDiversos += Math.round(Number(snapshot.val().valor));
        });
      })


    this.database.list('gastos/fixos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.adicionaGastos(snapshot.val());
          this.totalFixos += Math.round(Number(snapshot.val().valor));
        });
      })

    this.database.list('gastosCredito/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var descricao = snapshot.val().descricao;
          var ano = snapshot.val().ano;
          var mes = snapshot.val().mes;

          this.database.list('gastosCreditoHistorico/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                if (descricao == snapshot.val().descricao) {
                  this.adicionaGastos(snapshot.val());
                  this.arrayGastoCredito.push(snapshot.val());
                  total += Number(snapshot.val().valor);
                  this.totalCredito += Math.round(Number(snapshot.val().valor));
                }
              });
              this.gastoMes = Math.round(Number(this.totalFixos) + Number(this.totalDiversos) + Number(this.totalCredito));
              this.restante = Math.round(Number(this.saldoMes) - Number(this.gastoMes));
            })
        });
      })

  }
  adicionaGastos($gasto) {
    this.listaMaioresGastos.push(
      {
        "valor": $gasto.valor,
        "descricao": $gasto.descricao,
      }
    );
    this.listaMaioresGastos.sort(sortFunction);
    function sortFunction(a, b) {
      if (Math.round(a["valor"]) === Math.round(b["valor"])) {
        return 0;
      }
      else {
        return (Math.round(a["valor"]) < Math.round(b["valor"])) ? 1 : -1;
      }
    }
    if(  this.listaMaioresGastos.length > 4){
      this.listaMaioresGastos.length = 5;
    }


  }



  verDetalhes() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(ShoppingListPage);
  }
  navigateToaddShoppingPage() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }

  vaiParaMes(vaiPara) {
    var d = new Date();
    var mes;
    var ano;
    var data;

    if (vaiPara == 'proximo') {
      if (d.getMonth() == 12) {
        mes = '01';
        ano = (d.getFullYear() + 2);
        data = ano + '-' + mes;
      } else {
        mes = (d.getMonth() + 2) < 10 ? '0' + (d.getMonth() + 2) : (d.getMonth() + 2);
        ano = d.getFullYear();
        data = ano + '-' + mes;
      }
    } else {
      if (d.getMonth() == 2) {
        mes = '12';
        ano = (d.getFullYear() - 1);
        data = ano + '-' + mes;
      } else {
        mes = (d.getMonth() - 1) < 10 ? '0' + (d.getMonth() - 1) : (d.getMonth() - 1);
        ano = d.getFullYear();
        data = ano + '-' + mes;
      }
    }

    this.navCtrl.push(ShoppingListPage, { obj: data });

  }

  buscaMes() {
    var date = new Date(this.mes),
      locale = "pt-br",
      month = date.toLocaleString(locale, { month: "short" });
    this.stringMes = month;
  }

}