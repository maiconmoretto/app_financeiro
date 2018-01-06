import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ShoppingListPage } from '../shopping-list/shopping-list';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
   

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  navigateToaList(data) {
    console.log(data);

    if (data == undefined) {
      var d = new Date();
      data = "";
  
      var mes = (d.getMonth() + 1) < 10 ? "0" +  (d.getMonth() + 1):  (d.getMonth() + 1);
      data = d.getFullYear() + '-' + mes;

    }

    this.navCtrl.push(ShoppingListPage, { obj: data });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
