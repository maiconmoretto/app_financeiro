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
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController) {
    //database.list<ShoppingItem>('shopping-list').valueChanges().subscribe(console.log);
    //this.shoppingListRef$ = this.database.list('gastos').valueChanges();
    // this.shoppingListRef$ = this.database.list('shopping-list');
    this.shoppingListRef$ = this.database.list('gastos');
    //deleta toda colecao
    // this.database.list('gastos').remove();
  }
  
  selectShoppingItem(shoppingItem: ShoppingItem) {

    //display a actionsheet
    //1 - edit 
    //2 - remove item
    //3 - cancel selection
    this.actionSheetCtrl.create({
      title: '${ShoppingItem.itemName}',
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
            console.log(this);
            console.log('aqui ref  ' + this.shoppingListRef$);
            // this.database.object('/shopping-list/' + shoppingItem.$key).remove();
            //  this.shoppingListRef$.remove(shoppingItem.$key);
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
