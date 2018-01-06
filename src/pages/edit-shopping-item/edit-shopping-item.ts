import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-edit-shopping-item',
  templateUrl: 'edit-shopping-item.html',
})
export class EditShoppingItemPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditShoppingItemPage');
  }

}
