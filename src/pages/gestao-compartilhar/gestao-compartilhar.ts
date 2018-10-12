import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { EditConvitePage } from '../edit-convite/edit-convite';
/**
 * Generated class for the GestaoCompartilharPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gestao-compartilhar',
  templateUrl: 'gestao-compartilhar.html',
})
export class GestaoCompartilharPage {

  convitesEnviados = []
  convitesRecebidos = []
  emailUsuario;
  idUsuario;

  constructor(
    public navCtrl: NavController,
    public NavParams: NavParams,
    private fdb: AngularFireDatabase,
    private toastCtrl: ToastController,
    private database: AngularFireDatabase,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController) {
    this.listConvitesEnviados();
    this.listConvitesRecebidos();
    this.emailUsuario = this.authService.getCurrentUserEmail;
    this.idUsuario = this.authService.currentUserId;
  }


  listConvitesEnviados() {
    let self = this;
    this.database.list('/compartilhamento/', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'id_usuario',
        equalTo: this.authService.currentUserId
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          self.convitesEnviados.push(
            {
              aceto: snapshot.val().aceito,
              email_destinatario: snapshot.val().email_destinatario,
              id: snapshot.key
            }
          );
        });
      })
  }

  listConvitesRecebidos() {
    let self = this;
    this.database.list('/compartilhamento/', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'email_destinatario',
        equalTo: this.authService.getCurrentUserEmail
      }
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          self.convitesRecebidos.push(
            {
              aceto: snapshot.val().aceito,
              email_remetente: snapshot.val().email_remetente,
              id: snapshot.key
            }
          );
        });
      })
  }

  aceitarConvite(itemId) {
    alert('Convite aceito ' +itemId);
    // let msg = this.toastCtrl.create({
    //   message: 'Convite aceito ' +itemId,
    //   duration: 3000,
    //   position: 'top'
    // });

    // msg.onDidDismiss(() => {
    //   // console.log('Dismissed toast');
    // });
    // return;
  }



  enviarConvite(email) {
    if (email == undefined) {
      alert('Preencha todos os campos!');

      let msg = this.toastCtrl.create({
        message: 'preencha todos o email!',
        duration: 3000,
        position: 'top'
      });

      msg.onDidDismiss(() => {
        // console.log('Dismissed toast');
      });
      return;
    }

    this.fdb.list("/compartilhamento/").push({
      email_destinatario: email,
      id_usuario: this.authService.currentUserId,
      email_remetente: this.authService.getCurrentUserEmail,
      aceito: 'nao',
    });

    let toast = this.toastCtrl.create({
      message: 'Adicionado gasto com sucesso!',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
    // this.navCtrl.pop();
  }

  selectItem(itemId) {
    console.log(' idd -> ' + itemId)
    //display a actionsheet
    //1 - edit 
    //2 - remove item
    //3 - cancel selection
    this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            //send the item to edit item and pass key as parameter
            this.navCtrl.push(EditConvitePage,
              {
                itemId: itemId
              });
          }
        },
        // {
        //   text: 'Delete',
        //   role: 'destructive',
        //   handler: () => {
        //     //delete the current item
        //     this.convitesEnviados$.remove(itemId);
        //   }
        // },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
      ]
    }).present();

  }

}
