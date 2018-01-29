import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';
import { ShoppingItem } '../../models/shopping-item/shopping-item.interface'; 

@Component({
  selector: 'page-edit-shopping-item',
  templateUrl: 'edit-shopping-item.html',
})
export class EditShoppingItemPage {

  shoppingItemRef$: FirebaseObjectObservable<ShoppingItem>;
  shoppingItem = {} as ShoppingItem;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase) {

    //capture the shopping item id as  a nagParameter
    const shoppingItemId = this.navParams.get('shoppingItemId');
    const ano = this.navParams.get('ano');
    const mes = this.navParams.get('mes');
    console.log(shoppingItemId);
    console.log(ano);
    console.log(mes); 
    //set  the scope of our  firebase object to our selected item
    this.shoppingItemRef$ = this.database.object(`gastos/diversos/`+ano+`/`+mes+`/${shoppingItemId}`);
 
    
    //sucbscibe the  object, and assing the result  to this.ShoppingItem
    this.shoppingItemRef$.subscribe(
      shoppingItem => this.shoppingItem = shoppingItem);
  
  }

  //update  our  firebase node  whit new item data
  editShoppingItem(shoppingItem: ShoppingItem) {
    this.shoppingItemRef$.update(shoppingItem);
  }


}
