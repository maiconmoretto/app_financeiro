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

  // shoppingListRef$: FirebaseListObservable<ShoppingItem[]>
  //shoppingListRef$: Observable<ShoppingItem[]>;
  shoppingListRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosFixosRef$: FirebaseListObservable<ShoppingItem[]>;
  gastosCreditoRef$: FirebaseListObservable<ShoppingItem[]>;
  saldoMes = 4000;
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) {
    //deleta toda colecao
    // this.database.list('gastos').remove();
    this.data = this.navParams.data.obj;
    this.somaTotalGastos();
    this.buscaGastos();

  }

  buscaGastos() {
    this.shoppingListRef$ = this.database.list('gastos/diversos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2));
    this.gastosFixosRef$ = this.database.list('gastos/fixos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2));
    this.gastosCreditoRef$ = this.database.list('gastos/credito/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2));
  }

  somaTotalGastos() {

    this.database.list('gastos/diversos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          total += Number(snapshot.val().valor);
          // this.buscaGastosPorCategoria(snapshot.val().categoria);
        });
        this.gastoMes = Number(this.gastoMes) + Number(total);
        this.restante = Number(this.saldoMes) - Number(total);

      })

    this.database.list('gastos/fixos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {

          total += Number(snapshot.val().valor);
        });
        this.gastoMes = Number(this.gastoMes) + Number(total);
        this.restante = Number(this.restante) - Number(total);

      })

    this.database.list('gastos/credito/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          total += Number(snapshot.val().valor);
        });
        this.gastoMes = Number(this.gastoMes) + Number(total);
        this.restante = Number(this.restante) - Number(total);

      })





    // console.log('supermercado ' + this.supermercado);
    // console.log('lazer' + this.lazer);
    // console.log('conexao' + this.conexao);
    // console.log('transporte' + this.transporte);
    // console.log('farmacia' + this.farmacia);
    // console.log('casa ' + this.casa);
    // console.log('educacao ' + this.educacao);
    // console.log('poupanca ' + this.poupanca);
    // console.log('bem_estar' + this.bem_estar);
    // console.log('outros ' + this.outros);




  }

  buscaGastosPorCategoria() {

    var myObj = new Object();
    this.database.list('categorias/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var categoria = snapshot.val().descricao;
         

          // Add two expando properties that cannot be written in the
          // object.property syntax.
          // The first contains invalid characters (spaces), so must be
          // written inside square brackets.

          this.database.list('gastos/diversos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
            .subscribe(snapshots => {
              var total = 0;
              snapshots.forEach(snapshot => {
                if (categoria == snapshot.val().categoria) {
                  // console.log('aqui ' + categoria);
                  myObj[categoria] = "This is the property value";
                  
                }

              });


            })



          // console.log('nome ' + snapshot.val().descricao);
   

        });
      })
      console.log('myObj ' + myObj["casa"]);


    // if (categoria == "super") {
    //   this.supermercado++;
    // } else if (categoria == "lazer") {
    //   console.log('aqui lazer' + categoria);
    //   this.lazer++;
    // } else if (categoria == "conexão") {
    //   this.conexao++;
    // } else if (categoria == "transporte") {
    //   this.transporte++;
    // } else if (categoria == "casa") {
    //   console.log('aqui casa' + categoria);
    //   this.casa++;
    // } else if (categoria == "educação") {
    //   this.educacao++;
    // } else if (categoria == "poupança") {
    //   this.poupanca++;
    // } else if (categoria == "bem estar") {
    //   this.bem_estar++;
    // } else if (categoria == "outros") {
    //   this.outros++;
    // }




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
                ano: this.data.substr(0, 4),
                mes: this.data.substr(5, 2)
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

    if (this.database.list('gastos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2) + '/gastosFixos/') != null) {

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
              this.database.list('gastos/fixos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2)).remove().then(_ => console.log('deleted!'));
              this.database.list('gastosFixos/', { preserveSnapshot: true })
                .subscribe(snapshots => {
                  var total = 0;
                  snapshots.forEach(snapshot => {
                    this.database.list("/gastos/fixos/" + this.data.substr(0, 4) + '/' + this.data.substr(5, 2)).push({
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
            this.database.list("/gastos/fixos/" + this.data.substr(0, 4) + '/' + this.data.substr(5, 2)).push({
              valor: snapshot.val().valor,
              descricao: snapshot.val().descricao,
              gastoFixo: true
            });
          });

        })
    }


    function insere() {

    }
  }

  navigateToaddShoppingPage() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }

}
