import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';
import { EditShoppingItemPage } from '../edit-shopping-item/edit-shopping-item';
import * as $ from 'jquery';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  shoppingListRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosFixosRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosCreditoRef$: FirebaseListObservable<ShoppingItem[]>;
  categorias$: FirebaseListObservable<ShoppingItem[]>;

  saldoMes = 0;
  data;
  gastoMes = 0;
  gastoFixo = 0;;
  gastosCredito = 0;
  gastosDiversos = 0;
  restante = 0;
  arrayGastoCredito = [];

  categorias = [];
  supermercado;
  lazer;
  conexao;
  transporte;
  farmacia;
  casa;
  educacao;
  poupanca;
  bem_estar;
  outros;
  mes;
  ano;
  stringMes;
  myObj = new Object();

  //divisao
  totalDivididoMaicon = 0;
  totalMaicon = 0;
  gastosDivisiveisMaicon = 0;
  gastosIndividuaisMaicon = 0;
  gastosTotaisMaicon = 0;

  totalBruna = 0;
  gastosDivisiveisBruna = 0;
  gastosIndividuaisBruna = 0;
  gastosTotaisBruna = 0;
  totalDivididoBruna = 0;

  totalCredito = 0;
  totalDiversos = 0;
  totalFixos = 0;

  statusDiversos;
  statusCredito;
  statusFixos;
  statusCategorias;
  statusPorPessoa;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) {
    //deleta toda colecao
    // this.database.list('gastos').remove();
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
    this.buscaGastosPorCategoria();

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

    this.categorias$ = this.database.list('categorias/');

  }

  somaTotalGastos() {
    var total = 0;
    this.database.list('gastos/diversos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.buscaGastosPorPessoa(snapshot.val().gasto_por, snapshot.val().dividir, snapshot.val().valor);
          total += Number(snapshot.val().valor);
          this.totalDiversos += Math.round(Number(snapshot.val().valor));
        });
      })


    this.database.list('gastos/fixos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.buscaGastosPorPessoa(snapshot.val().gasto_por, snapshot.val().dividir, snapshot.val().valor);
          this.totalFixos += Math.round(Number(snapshot.val().valor));
        });
      })


    this.database.list('gastosCredito/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var descricao = snapshot.val().descricao;
          var ano = snapshot.val().ano;
          var mes = snapshot.val().mes;
          var dividir = snapshot.val().dividir;
          var gasto_por = snapshot.val().gasto_por;

          this.database.list('gastosCreditoHistorico/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                if (descricao == snapshot.val().descricao) {
                  this.arrayGastoCredito.push(
                    {
                      categoria: snapshot.val().categoria,
                      data: snapshot.val().data,
                      data_cadastro: snapshot.val().data_cadastro,
                      descricao: snapshot.val().descricao,
                      gasto_por: snapshot.val().gasto_por,
                      parcela: snapshot.val().parcela,
                      dividir: dividir,
                      valor: snapshot.val().valor,
                    }
                  );
                  this.buscaGastosPorPessoa(snapshot.val().gasto_por, snapshot.val().dividir, snapshot.val().valor);
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

  buscaGastosPorPessoa(gasto_por, dividir, valor) {
    var totBruna = 0;
    var totDivididoBruna = 0;
    //gastos divisiveis
    var gastosDivBruna = 0;
    //gastos individuais
    var gastosIndBruna = 0;

    var totMaicon = 0;
    var totDivididoMaicon = 0;
    //gastos divisiveis
    var gastosDivMaicon = 0;
    //gastos individuais
    var gastosIndMaicon = 0;
    //gastos individuais
    if (gasto_por == "Maicon" && dividir == "nao") {
      gastosIndMaicon += Number(valor);

      //gastos individuais
    } else if (gasto_por == "Bruna" && dividir == "nao") {
      gastosIndBruna += Number(valor);

      //gastos divisiveis bruna
    } else if (gasto_por == "Bruna" && dividir == "sim") {
      gastosDivBruna += Number(valor);

      //gastos divisiveis Maicon
    } else if (gasto_por == "Maicon" && dividir == "sim") {

      gastosDivMaicon += Number(valor);
    }
    this.gastosIndividuaisBruna += Math.round(Number(gastosIndBruna));
    this.gastosIndividuaisMaicon += Math.round(Number(gastosIndMaicon));
    this.gastosDivisiveisBruna += Math.round(Number(gastosDivBruna));
    this.gastosDivisiveisMaicon += Math.round(Number(gastosDivMaicon));
  }

  buscaGastosPorCategoria() {
    this.database.list('categorias/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var categoria = snapshot.val().descricao;
          //soma gastos diversos por categoria
          this.database.list('gastos/diversos/' + this.ano + '/' + this.mes, {
            preserveSnapshot: true,
            query: {
              orderByChild: 'categoria',
              equalTo: categoria
            }
          })
            .subscribe(snapshots => {
              var total = 0;
              snapshots.forEach(snapshot => {
                this.myObj[categoria] = this.myObj[categoria] == undefined ? snapshot.val().valor : Number(this.myObj[categoria]) + Number(snapshot.val().valor);
              });
            })

          //soma gastos fixos por categoria
          this.database.list('gastos/fixos/' + this.ano + '/' + this.mes, {
            preserveSnapshot: true,
            query: {
              orderByChild: 'categoria',
              equalTo: categoria
            }
          })
            .subscribe(snapshots => {
              var total = 0;
              snapshots.forEach(snapshot => {
                this.myObj[categoria] = this.myObj[categoria] == undefined ?  Math.ceil( snapshot.val().valor ):  
                Math.ceil(Number(this.myObj[categoria]) + Number(snapshot.val().valor) );
           
              });
            })
            console.log('entrou');
          //soma gastos fixos por categoria
          this.database.list('gastosCredito/', { preserveSnapshot: true })
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
           
                var descricao = snapshot.val().descricao;
                var ano = snapshot.val().ano;
                var mes = snapshot.val().mes;
                console.log('desc '+descricao); 
                this.database.list('gastosCreditoHistorico/' + this.ano + '/' + this.mes, { preserveSnapshot: true, })
                  .subscribe(snapshots => {
                    snapshots.forEach(snapshot => {
                      if (descricao == snapshot.val().descricao) {
                        if (categoria == snapshot.val().categoria) {
                          this.myObj[categoria] = this.myObj[categoria] == undefined ? snapshot.val().valor : Number(this.myObj[categoria]) + Number(snapshot.val().valor);
                        }
                      }
                    });

                  })
              });
            })






        });
      })
  }


  selectShoppingItem(shoppingItem: ShoppingItem) {
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
                shoppingItemId: shoppingItem.$key,
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
            this.shoppingListRef$.remove(shoppingItem.$key);
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


  importarGastosFixos() {
    this.database.list('gastos/fixos/' + this.ano + '/' + this.mes).remove();
    this.database.list('gastosFixos/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          this.database.list("/gastos/fixos/" + this.ano + '/' + this.mes).push({
            valor: snapshot.val().valor,
            descricao: snapshot.val().descricao,
            gastoFixo: true,
            dividir: snapshot.val().dividir,
            categoria: snapshot.val().categoria,
            gasto_por: snapshot.val().gasto_por,
          });
        });

      })

  }

  navigateToaddShoppingPage() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }



  buscaMes() {
    var date = new Date(this.mes),
      locale = "pt-br",
      month = date.toLocaleString(locale, { month: "short" });
    this.stringMes = month;
  }

  hideShowDiversos(status) {
    this.statusDiversos = status;
  }
  hideShowCredito(status) {
    this.statusCredito = status;
  }
  hideShowFixos(status) {
    this.statusFixos = status;
  }
  hideShowCategorias(status) {
    this.statusCategorias = status;
  }
  hideShowPorPessoa(status) {
    this.statusPorPessoa = status;
  }



}