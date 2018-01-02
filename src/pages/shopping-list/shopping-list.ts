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
  saldoMes = "4000";
  data;
  gastoMes;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController) {
    //database.list<ShoppingItem>('shopping-list').valueChanges().subscribe(console.log);
    //this.shoppingListRef$ = this.database.list('gastos').valueChanges();
    // this.shoppingListRef$ = this.database.list('shopping-list');

    //deleta toda colecao
    // this.database.list('gastos').remove();
    this.data = this.navParams.data.obj;
    this.shoppingListRef$ = this.database.list('gastos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2));
    // this.saldoMes = this.database.list('saldos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2)+'/');

  

    // this.database.list('gastos/' + this.data.substr(0, 4) + '/' + this.data.substr(5, 2), { preserveSnapshot: true })
    //   .subscribe(snapshots => {
     
    //     snapshots.forEach(snapshot => {
    //       console.log(snapshot.key, snapshot.val().valor);
    //       var gastoMes2 = this.gastoMes;
    //       gastoMes2=10;
    //     });
    //   })


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

  navigateToaddShoppingPage() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }

}
