import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  // shoppingListRef$: FirebaseListObservable<ShoppingItem[]>
  //shoppingListRef$: Observable<ShoppingItem[]>;
  shoppingListRef$: FirebaseListObservable<ShoppingItem[]>

  saldoMes = 4000;
  data;
  gastoMes;
  gastosFixos;
  restante;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController) {
    //deleta toda colecao
    // this.database.list('gastos').remove();
    this.data = this.navParams.data.obj;
    this.somaTotalGastos();
    this.buscaGastos();

  }

  buscaGastos() {
    this.shoppingListRef$ = this.database.list('gastos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2));
  }

  somaTotalGastos() {
    this.database.list('gastos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {
          // var gastoMes2 = this.gastoMes;
          // console.log(snapshot.key, snapshot.val().valor);
          // gastoMes2.push(snapshot.val().valor);
          // console.log( this.gastoMes);
          total += Number(snapshot.val().valor);
        });
        this.gastoMes = total;
  
        this.restante = Number(this.saldoMes)  - Number(this.gastoMes);

      })
   
    // var sum = this.gastoMes.reduce(add, 0);

    // function add(a, b) {
    //   return a + b;
    // }

    // console.log('soma '+sum); // 6

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
    console.log('aqui');

    this.database.list("/gastos/" + this.data.substr(0, 4) + '/' + this.data.substr(5, 2) + '/').push({
      gastosFixos: 1232132
    });

    this.database.list('gastosFixos/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        var total = 0;
        snapshots.forEach(snapshot => {

          console.log(snapshot.key, snapshot.val().valor, snapshot.val().descricao);
          this.database.list("/gastos/" + this.data.substr(0, 4) + '/' + this.data.substr(5, 2) + '/').push({
            valor: snapshot.val().valor,
            descricao: snapshot.val().descricao,
            gastoFixo: true
          });
        });

      })

  }

  navigateToaddShoppingPage() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }

}
