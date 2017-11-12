import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  // shoppingListRef$: FirebaseListObservable<ShoppingItem[]>
  shoppingListRef$: Observable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase) {
    database.list<ShoppingItem>('shopping-list').valueChanges().subscribe(console.log);
    this.shoppingListRef$ = this.database.list('shopping-list').valueChanges();
    // this.shoppingListRef$ = this.database.list('shopping-list');


  }

  navigateToaddShoppingPage() {
    //navigagte  the user to AddShoppingPage
    this.navCtrl.push(AddShoppingPage);
  }

}
