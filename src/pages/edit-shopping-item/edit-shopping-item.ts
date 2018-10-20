import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-edit-shopping-item',
  templateUrl: 'edit-shopping-item.html',
})
export class EditShoppingItemPage {
 
  shoppingItemRef$: FirebaseObjectObservable<ShoppingItem>;
  shoppingItem = {} as ShoppingItem;
  categorias = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private authService: AuthService) {
 console.log('aqui '+ this.navParams.get('shoppingItemId'));
    //capture the shopping item id as  a nagParameter
    const shoppingItemId = this.navParams.get('shoppingItemId');
    const ano = this.navParams.get('ano');
    const mes = this.navParams.get('mes');
  
    //set  the scope of our  firebase object to our selected item
    this.shoppingItemRef$ = this.database.object(
      this.authService.currentUserId+`/gastos/diversos/`+ano+`/`+mes+`/${shoppingItemId}`);
 
    
    //sucbscibe the  object, and assing the result  to this.ShoppingItem
    this.shoppingItemRef$.subscribe(
      shoppingItem => this.shoppingItem = shoppingItem);
      this.listaCategorias();
    }
   
    listaCategorias() {
      this.database.list(this.authService.currentUserId+'/categorias/', { preserveSnapshot: true })
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            this.categorias.push(snapshot.val().descricao);
            this.categorias.sort();
          })
        })
    }

  //update  our  firebase node  whit new item data
  editShoppingItem(shoppingItem: ShoppingItem) {
    this.shoppingItemRef$.update(shoppingItem);
    let toast = this.toastCtrl.create({
      message: 'Gasto editado com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    }); 
    toast.present();
  }


}
