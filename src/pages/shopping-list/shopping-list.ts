import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';

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
  gastoFixo;
  gastosCredito;
  gastosDiversos;
  gastosFixos;
  restante;
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
        });
           this.gastoMes = Number( this.gastoMes) + Number(total);
        this.restante = Number(this.saldoMes) - Number(total);
   
      })
    this.database.list('gastos/fixos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {

          total += Number(snapshot.val().valor);
        });
        this.gastoMes = Number( this.gastoMes) + Number(total);
        this.restante = Number(this.restante) - Number(total);

      })
    this.database.list('gastos/credito/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          total += Number(snapshot.val().valor);
        });
        this.gastoMes = Number( this.gastoMes) + Number(total);
        this.restante = Number(this.restante) - Number(total);

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
