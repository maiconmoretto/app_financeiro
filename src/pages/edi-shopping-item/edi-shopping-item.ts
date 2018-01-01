import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-edi-shopping-item',
  templateUrl: 'edi-shopping-item.html',
})
export class EdiShoppingItemPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EdiShoppingItemPage');
  }

}
