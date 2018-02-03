import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';
import { EditShoppingItemPage } from '../edit-shopping-item/edit-shopping-item';

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
  gastosCredito = 0;;
  gastosDiversos = 0;;
  restante = 0;

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
  totalMaicon = 0;
  totalBruna = 0;


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
    this.gastosCreditoRef$ = this.database.list('gastos/credito/' + this.ano + '/' + this.mes);
    this.categorias$ = this.database.list('categorias/');
  }

  somaTotalGastos() {

    var totBruna = 0;
    var totMaicon = 0;
    var total = 0;
    this.database.list('gastos/diversos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().dividir == "sim") {
            totBruna += Number(snapshot.val().valor / 2);
            totMaicon += Number(snapshot.val().valor / 2);
          } else if (snapshot.val().gasto_por == "Maicon" && snapshot.val().dividir == "nao") {
            totMaicon += Number(snapshot.val().valor);
          } else if (snapshot.val().gasto_por == "Bruna" && snapshot.val().dividir == "nao") {
            totBruna += Number(snapshot.val().valor);
          }
          total += Number(snapshot.val().valor);
        });

        // this.totalMaicon = Number(this.totalMaicon) + Number(totMaicon);
        // this.totalBruna = Number(this.totalBruna) + Number(totBruna);
        // this.gastoMes = Math.round(Number(this.gastoMes) + Number(total));
        // this.restante = Math.round(Number(this.saldoMes) - Number(total));

      })


    this.database.list('gastos/fixos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().dividir == "sim") {
            totBruna += Number(snapshot.val().valor / 2);
            totMaicon += Number(snapshot.val().valor / 2);
          } else if (snapshot.val().gasto_por == "Maicon" && snapshot.val().dividir == "nao") {
            totMaicon += Number(snapshot.val().valor);
          } else if (snapshot.val().gasto_por == "Bruna" && snapshot.val().dividir == "nao") {
            totBruna += Number(snapshot.val().valor);
          }
          total += Number(snapshot.val().valor);
        });
        // this.totalMaicon = totMaicon;
        // this.totalBruna = totBruna;
        // this.gastoMes = Math.round(Number(this.gastoMes) + Number(total));
         // this.restante = Math.round(Number(this.saldoMes) - Number(total));

      })

    this.database.list('gastos/credito/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().dividir == "sim") {
            totBruna += Number(snapshot.val().valor / 2);
            totMaicon += Number(snapshot.val().valor / 2);
          } else if (snapshot.val().gasto_por == "Maicon" && snapshot.val().dividir == "nao") {
            totMaicon += Number(snapshot.val().valor);
          } else if (snapshot.val().gasto_por == "Bruna" && snapshot.val().dividir == "nao") {
            totBruna += Number(snapshot.val().valor);
          }
          total += Number(snapshot.val().valor);
        });
        this.totalMaicon = totMaicon;
        this.totalBruna = totBruna;
        this.gastoMes = Math.round(Number(this.gastoMes) + Number(total));
        this.restante = Math.round(Number(this.saldoMes) - Number(total));

      })

  }


  buscaGastosPorCategoria() {
    this.database.list('categorias/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var categoria = snapshot.val().descricao;

          // Add two expando properties that cannot be written in the
          // object.property syntax.
          // The first contains invalid characters (spaces), so must be
          // written inside square brackets.

          this.database.list('gastos/diversos/' + this.ano + '/' + this.mes, { preserveSnapshot: true })
            .subscribe(snapshots => {
              var total = 0;
              snapshots.forEach(snapshot => {
                if (categoria == snapshot.val().categoria) {
                  this.myObj[categoria] = this.myObj[categoria] == undefined ? snapshot.val().valor : Number(this.myObj[categoria]) + Number(snapshot.val().valor);

                }

              });


            })
        });
      })
  }


  selectShoppingItem(shoppingItem: ShoppingItem) {
    console.log(shoppingItem);
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
            console.log('the user has selected the cancel button');

          }
        },
      ]

    }).present();
  }


  importarGastosFixos() {
    if (this.database.list('gastos/' + this.ano + '/' + this.mes + '/gastosFixos/') != null) {

      let alert = this.alertCtrl.create({
        title: 'Importar gasos fixos',
        message: 'Já foi realizada uma importação, deseja imortar novamente?<br>Isso irá apagar a importação existente!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {

            }
          },
          {
            text: 'Importar',
            handler: () => {
              this.database.list('gastos/fixos/' + this.ano + '/' + this.mes).remove();
              this.database.list('gastosFixos/', { preserveSnapshot: true })
                .subscribe(snapshots => {
                  var total = 0;
                  snapshots.forEach(snapshot => {
                    this.database.list("/gastos/fixos/" + this.ano + '/' + this.mes).push({
                      valor: snapshot.val().valor,
                      descricao: snapshot.val().descricao,
                      gastoFixo: true
                    });
                  });

                })
            }
          }
        ]
      });
      alert.present();
    } else {
      this.database.list('gastosFixos/', { preserveSnapshot: true })
        .subscribe(snapshots => {
          var total = 0;
          snapshots.forEach(snapshot => {
            this.database.list("/gastos/fixos/" + this.ano + '/' + this.mes).push({
              valor: snapshot.val().valor,
              descricao: snapshot.val().descricao,
              gastoFixo: true
            });
          });

        })
    }
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

}
