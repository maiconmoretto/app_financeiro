import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

/**
 * Generated class for the EditCategoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-categoria',
  templateUrl: 'edit-categoria.html',
})
export class EditCategoriaPage {

  shoppingItemRef$: FirebaseObjectObservable<ShoppingItem>;
  shoppingItem = {} as ShoppingItem;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private authService: AuthService) {
    const shoppingItemId = this.navParams.get('shoppingItemId');
    this.shoppingItemRef$ = this.database.object(
      this.authService.currentUserId + `/categorias/${shoppingItemId}`);
      this.shoppingItemRef$.subscribe(
        shoppingItem => this.shoppingItem = shoppingItem);
  }

  //update  our  firebase node  whit new item data
  editShoppingItem(shoppingItem: ShoppingItem) {
    this.shoppingItemRef$.update(shoppingItem);
    let toast = this.toastCtrl.create({
      message: 'Categoria editada com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });
    toast.present();
  }

}
