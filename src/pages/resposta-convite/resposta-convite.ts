import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

/**
 * Generated class for the RespostaConvitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resposta-convite',
  templateUrl: 'resposta-convite.html',
})
export class RespostaConvitePage {


  itemRef$: FirebaseObjectObservable<ShoppingItem>;
  item = {} as ShoppingItem;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {
    const itemId = this.navParams.get('itemId');
    this.itemRef$ = this.database.object('compartilhamento' + `/${itemId}`);
    this.itemRef$.subscribe(
      item => this.item = item);
  }
  

  responderConvite(item: ShoppingItem) {
    this.itemRef$.update(item);
    let toast = this.toastCtrl.create({
      message: 'Convite respondido com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });
    toast.present();
  }

}
